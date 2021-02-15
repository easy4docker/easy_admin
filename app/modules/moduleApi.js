(function() {
    var obj = function(env, pkg, req, res) {
        var me = this,
            fs = require('fs');

		var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        const   data_dir = me.comm.inside.data,
                gridServerFn = me.comm.file.gridServer;

        var MServers = pkg.require(env.root+ '/modules/moduleServer.js');
        var Servers = new MServers(env, pkg, req, res);

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
                mp = p.match(/\/([^\/]+)\/([^\/]+)(\/|)$/);
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
                'startVServer', 'gitSiteBranchs', 'gitSwitchBranch',
                'deleteVServer', 'addServer', 'setupServer',
                'localGridAccessSetup', 'syncAppCode',
                'addGrid', 'getGrids'
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

        me.syncAppCode = (cbk) => {
            const shell_str = 'cd ' + me.comm.inside.root + ' && git pull';
            exec(shell_str, {maxBuffer: 224 * 2048},
                function(error, stdout, stderr) {
                    cbk({status : 'success'})
            });
        }

        me.setupServer = (cbk) => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
            var git = new MGit(env, pkg);

			git.gitRemoteBranchs(req.body.data, me.comm.inside.data, (result) => {
                if (result.status === 'success') {
                    const data = result;
                    delete data.status;
                    data.gitHub = req.body.data.gitHub;
                    Servers.addVServer(result, (result1) => {
                        cbk(result1);
                    });
                } else {
                    cbk(result);
                }
			});
		}
        /*----- Grid related --- */
        me.localGridAccessSetup = (cbk) => {
            const data = req.body.data;
            cbk({status: 'success', gridServer : data.gridServer, token : pkg.md5(data.password)});
        }

        me.addGrid = me.getGrids = (cbk) => {
            var MGirid = pkg.require(env.root+ '/modules/moduleGrid.js');
            var grid = new MGirid(env, pkg, req, res);
            grid[req.body.cmd](cbk);
        }
        /*----- Grid related --- */

        me.gitSiteBranchs = (cbk) => {
			Servers.gitSiteBranchs(req.body.serverName, (result) => {
				cbk(result);
			});
        }
        
        me.gitSwitchBranch = (cbk) => {
			var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
            var git = new MGit(env, pkg);
            Servers.getSites((list) => {
                const siteCfg = (!list[req.body.serverName]) ? {} : list[req.body.serverName];
                const postData= {gitHub: siteCfg.gitHub, branch: req.body.branch};
                git.gitRemoteBranchs(postData, me.comm.inside.data, (result) => {
                    if (result.status === 'success') {
                        Servers.gitSwitchBranch(req.body.serverName, req.body.branch, (resultS) => {
                            if (resultS.status === 'success') {
                                Servers.startVServer(req.body.serverName, ()=> {
                                    cbk({status : 'success'})
                                 })
                            } else {
                                cbk(resultS);
                            }
                        });
                    } else {
                        cbk(result);
                    }
                });
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
            pkg.readJson(me.comm.file.authToken, (authToken) => {
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
            });
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
