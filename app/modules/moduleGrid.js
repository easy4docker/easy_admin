(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            git_root = '/var/_localRoot',
            app_dir = '/var/_localApp',
            data_dir = '/var/_localAppData',
            key_dir = '/var/_localAppKey',
            gridStatusFn = data_dir + '/_gridMatrix.json',
            gridServerFn = key_dir + '/_gridServers.json',
            gridTokenFn = key_dir + '/_gridToken';
            
        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}
        
        me.get = () => {
            let p = req.params[0],
                mp = p.match(/\/([^\/]+)\/([^\/]+)(\/|$)/);
            if (mp) {
                switch (mp[2])  {
                    case 'updateStatus':
                        // for cron access 
                        me.updateStatus(req.query, (result) => {
                            res.send(result);
                        });
                        break;

                    case 'renewToken':
                        me.renewToken((result) => {
                            res.send(result);
                        });
                        break;

                    case 'testToken':
                        me.testToken((result) => {
                            res.send(result);
                        });
                        break;

                    case 'getGridMatrix':
                        me.getGridMatrix();
                        break;

                    case 'gridHub':
                        me.gridHub(req.query, (result) => {
                            res.send(result);
                        });
                        break;
                    default:
                        res.send('wrong path ' + p);
                        break;        
                }
            } else {
                res.send('wrong path');
            }
            
        };

        me._post = () => {
            if (typeof me[req.body.cmd] === 'function') {
                me[req.body.cmd](req.body.setting, (result) => {
                    res.send(result);
                });
            } else {
                res.send({status:'failure', message : '404 wrong cmd ' + req.body.cmd + ' !'});
            }
        };

		me.post = () => {
            me._post();
            return true;
            const token = (req.query.gridToken) ? req.query.gridToken : 
                (!req.body.setting) ? '' : req.body.setting.gridToken;
            if (pkg.md5(token) !== pkg.md5('Driverside8#')) {
                res.send({status : 'failuer7', token : token});
            } else {
                me._post();
            }
        };

        me.gridAccess = () => {
            res.send({status : 'success', token : pkg.md5(req.body.password)});
        };
        
        me.gridHub = (setting, callback) => {

            fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
                if ((!setting || !setting.gridToken || setting.gridToken != gridToken) && req.hostname !== 'localhost' && setting.cmd !== 'getGridMatrix') {
                    callback({status:'failuer', message: 'Unauthorized gridToken!'});
                } else {
                    const request = require('request');
                    let server = (/^localhost/ig.test(setting.server)) ? 'localhost' : setting.server;
                    server = setting.server;
                    const dataGridMatrix = me.dataGridMatrix();
                    if (!dataGridMatrix[server] && server != 'grid.shusiou.win') {
                        callback({status:'failuer', message: 'gridHub refused unauthorized server ' + server + '!'});
                    } else if (setting.cmd === 'gridHub') {
                        callback({status:'failuer', message: 'gridHub can not hub route itself!'});
                    } else {
                        server = (/^http\:\/\//.test(server)) ? server : ('http://' + server)
                        var channel = (!setting.channel) ? '_grid' : setting.channel;
                        request.post({url: server + ':10000/' + channel + '/', form: setting}, function(err,httpResponse,body){      
                            if (setting.type === 'json') {
                                var result = {};
                                try { result = JSON.parse(body);} catch (e) {}   
                                callback(result);
                             //   callback(me.dataGridMatrix());
                            } else {
                                callback(body);
                             //   callback(me.dataGridMatrix());
                            } 
                        });
                    }
                }
            });
        }

        me.getGridMatrix = () => {
            res.send({status: 'success', result: me.dataGridMatrix()});
        }

        me.dataGridMatrix = () => {
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids;
        }

        me.renewToken = (callback) => {
            const oldToken = req.query.old;
            fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
                if (gridToken !== oldToken) {
                    callback('');
                } else {
                    const newToken = me.makeid(32);
                    fs.writeFile(gridTokenFn, newToken, (err) => {
                        callback((err) ? '' : newToken);
                    });
                }
            });
        }
    
        me.updateStatus = (data, callback) => {
            let grids = me.dataGridMatrix();
            if (!data || !data.ip || !data.token ) {
                cbk(false);
            } else {
                const _f = {};
                _f['newToken'] = (cbk) => {
                    const cmdStr = 'curl http://' + data.ip + ':10000/_grid/renewToken/?old=' + data.token;
                    exec(cmdStr, {maxBuffer: 1024 * 2048},
                        function(error, stdout, stderr) {
                            var v = stdout.replace(/\s+/, '');
                            if ((error) || !v) {
                                cbk(false);
                                CP.exit = true;
                            } else {
                                cbk(v);
                            }
                    });
                }
                _f['saveGridStatus'] = (cbk) => {
                    grids[data.ip] = {tm: new Date().getTime(), gridToken: CP.data.newToken, server: data.server, tag: data.tag};
                    fs.writeFile(gridStatusFn, JSON.stringify(grids), (err) => {
                        cbk(true);
                    });
                }
                
                CP.serial(_f, (data) => {
                    callback(true);
                }, 3000)
            } 
        }

        me.getGrids = () => {
            res.send({status: "success", result: me.dataGrids()});
        }
        me.dataGrids = () => {
            let grids = {};
            try {
                grids = pkg.require(gridServerFn);
            } catch (e) {}
            return grids;
        }

        me.makeid = (length) => {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }

        me.addGrid = () => {
            var data = req.body;
            const _f = {};

            let gridServer = me.dataGrids();
            if (data.gridServer) {
                gridServer[data.gridServer] = data.tag;
            }

            _f['saveGrids'] = (cbk) => {
                fs.writeFile(gridServerFn, JSON.stringify(gridServer), (err) => {
                    cbk(true);
                });
            };

            _f['gridTokenFn'] = (cbk) => {
                fs.writeFile(gridTokenFn, me.makeid(32), (err) => {
                    cbk(true);
                });
            };
            _f['addToCron'] = (cbk) => {
                let shell_fn = (_env.env === 'local')? (_env.data_folder + '/log/ctab') : '/etc/crontab';
                let shell_str = "sed '/\echo _EASY_GRID_SYNC/d' " + shell_fn + " > /tmp/crontab_easy_grid &&  cp -f /tmp/crontab_easy_grid " + shell_fn;
              
                shell_str += "\n" + 'echo "*/2 * * * *  root (echo _EASY_GRID_SYNC && cd  ' + _env.app_root + ' && sh _gridSync.sh ' + 
                    data.gridServer + ' ' + data.tag + ')" >> ';

                if (_env.env === 'local') {
                    shell_str += _env.data_folder + '/log/ctab';
                } else {
                    shell_str += '/etc/crontab';
                }
                me.setCron('gridSync', shell_str, (err) => {
                    cbk(true);
                });
            }
            CP.serial(_f, (data) => {
                me.getGrids();
            }, 3000)

        }

        me.syncAppCode = () => {
            const shell_str = 'cd ' + git_root + ' && git pull';
            exec(shell_str, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    res.send({status : 'success'})
            });
        }
        me.removeGrid = () => {
            var data = req.body;
            const _f = {};
            let gridServer = me.dataGrids();
            _f['demoveGrid'] = (cbk) => {
                if (data.gridServer) {
                    delete gridServer[data.gridServer];
                }
                fs.writeFile(gridServerFn, JSON.stringify(gridServer), (err) => {
                    cbk(true);
                });
            };
            _f['removeCron'] = (cbk) => {
                let shell_fn = (_env.env === 'local')? (_env.data_folder + '/log/ctab') : '/etc/crontab';
                let shell_str = "sed '/\echo _EASY_GRID_SYNC/d' " + shell_fn + " > /tmp/crontab_easy_grid &&  cp -f /tmp/crontab_easy_grid " + shell_fn;
                me.setCron('remove-grid', shell_str, (err) => {
                    cbk(true);
                });
            }
            
            CP.serial(_f, (data) => {
                me.getGrids();
            }, 3000)
        }

        me.setCron = (code, str, callback) => {
            fs.writeFile(data_dir + '/commCron/' + code + '_' + new Date().getTime() + '.sh', str, function (err) {
                callback({status:'success'});
            });
        }
    }
    module.exports = obj;
})()