(function() {
    var obj = function(env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            git_root = '/var/_localRoot',
            app_dir = '/var/_localApp',
            data_dir = '/var/_localAppData',
            key_dir = '/var/_localAppKey',
            gridStatusFn = data_dir + '/_gridMatrix.json';

		var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        var MServers = pkg.require(env.root+ '/modules/moduleServer.js');
        var Servers = new MServers(env, pkg);

        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}

        me.call = (rest, bypassLocalAuth) => {
            if (!bypassLocalAuth) {
                var token = (req.query.authToken) ? req.query.authToken : (req.body.authToken) ? req.body.authToken : '';
                if (req.body.cmd !== 'auth') {
                    me.localTokenValidation(
                        token, me[rest]
                    );
                } else {
                    me[rest]();
                } 
            } else {
                me.comm.sendAction('', 'wrong authentication token!');
            }
        }
        
        me.get = () => {
            let p = req.params[0],
                mp = p.match(/\/([^\/]+)\/([^\/]+)(\/|$)/);
            const METHODS = [
                'getIP', 'getToken'
            ];
            if (METHODS.indexOf(mp[2]) === -1) {
               me.comm.sendErrorJson('wrong path ' + p + '!');
            } else {
                try {
                    me[mp[2]]((data) => {
                       me.comm.output(data);
                    });
                } catch (e) {
                   me.comm.sendErrorJson('wrong path ' + p + '!');
                }
            }
        };

        me.post = () => {
            const METHODS = [
                'getIP', 'getLocalEnv', 'getServerToken', 'auth', 'loadList', 'pullCode', 'stopVServer', 
                'startVServer', 'gitRemoteBranchs', 'gitSiteBranchs', 'gitSwitchBranch',
                'deleteVServer', 'addServer'
            ];
            if (METHODS.indexOf(req.body.cmd) === -1) {
               me.comm.sendErrorJson('missing cmd!');
            } else {
                try {
                    me[req.body.cmd]((data) => {
                       me.comm.output(data);
                    });
                } catch (e) {
                   me.comm.sendErrorJson('wrong cmd ' + req.body.cmd + '!');
                }
            }
        };
        me.auth = (cbk) => {
            var MAuth= pkg.require(env.root+ '/modules/moduleAuth.js');
            var auth = new MAuth(env, pkg, req, res);
            var data = (!req.body.data) ? {} : req.body.data;
            if (req.body.authToken) data.authToken = req.body.authToken;
            auth.action(data, (data) => {
                res.send(data);
            });
        }
        me.loadList = (cbk) => {
            Servers.postLoadList(
                (data) => {
                    me.refreshTokenSend(data, cbk);
                });
        }

        me.stopVServer = me.pullCode = 
        me.startVServer = (cbk) => {
            Servers[req.body.cmd](req.body.serverName,
                (data) => {
                    me.refreshTokenSend(data, cbk);
                });
        }

        me.gitRemoteBranchs = (cbk) => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
			var git = new MGit(env, pkg);
			git.gitRemoteBranchs(req.body.data, (result) => {
				cbk(result);
			});
		}

        me.gitSiteBranchs = (cbk) => {
			Servers.gitSiteBranchs(req.body.serverName, (result) => {
				cbk(result);
			});
        }
        
        me.gitSwitchBranch = (cbk) => {
			Servers.gitSwitchBranch(req.body.serverName, req.body.branch, (result) => {
				cbk(result);
			});
        }
        
        me.addServer = (cbk) => {
			Servers.addVServer(req.body.data, (result) => {
				cbk(result);
			});
        }
        me.deleteVServer = (cbk) => {
			Servers.deleteVServer(req.body.data.serverName, (result) => {
				cbk(result);
			});
        }

        me.localTokenValidation = (token, success) => {
            let authToken = {};
            try {
                authToken = pkg.require(me.comm.file.authToken );
            } catch (e) {}
            for (var o in authToken) {
                if (new Date().getTime() - authToken[o] > me.comm.SESSION_TIMEOUT) {
                   delete authToken[o];
                }
            }
            if (authToken[token]) {
                authToken[token] = new Date().getTime();
                fs.writeFile(me.comm.file.authToken, JSON.stringify(authToken), 
                (err) => {
                    success();
                });
            } else {
                me.comm.sendAction('', 'wrong authentication token!');
            }
        }
      
        me.getIP = (cbk) => {
            fs.readFile(data_dir+ '/_ip', 'utf-8', (err, data) => {
                cbk({status: 'success', result : data});
            });
        }

        me.getLocalEnv = (cbk) => {
            fs.readFile(data_dir+ '/_ip', 'utf-8', (err, data) => {
                cbk({status: 'success', result : {IP: data}});
            });
        }

        me.getToken = (cbk) => {
            fs.readFile(me.comm.file.gridToken, 'utf-8', (err, data) => {
                cbk({status: 'success', result : data});
            });
        }
        me.getServerToken = (cbk) => {
            me.getIP(
                (dataGetIP) => {
                    me.getToken((dataGetToken) => {
                        cbk({status: 'success', ip : dataGetIP.result, gridToken : dataGetToken.result});
                    })
            });
        }
        me.refreshTokenSend = (data, cbk) => {
			var MAuth= pkg.require(env.root+ '/modules/moduleAuth.js');
			var auth = new MAuth(env, pkg, req, res);
			auth.refreshAuthToken(
				req.body.authToken,
				() => {
					cbk(data);
				}
			)
		};

    }
    module.exports = obj;
})()
