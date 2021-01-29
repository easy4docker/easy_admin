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
            gridTokenFn = key_dir + '/_gridToken',
            gridOldTokenFn = key_dir + '/_gridOldToken';

        var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.common = new MCommon(env, pkg, req, res);
        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}
        
        me.call = (rest, bypassGridAuth) => {
            
            if (!bypassGridAuth) {
                var gridToken = (req.query.gridToken) ? req.query.gridToken : (req.body.gridToken) ? req.body.gridToken : '';
                me.gridTokenValidation(gridToken, me[rest]);
            } else {
                me[rest]();
            }
        }

        me.get = () => {
            let p = req.params[0],
            mp = p.match(/\/([^\/]+)\/([^\/]+)(\/|$)/);
            const METHODS = [
                'renewToken', 'serverMem'
            ];
            if (METHODS.indexOf(mp[2]) === -1) {
               me.common.sendErrorJson('wrong path ' + p + '!');
            } else {
                try {
                    me[mp[2]]((data) => {
                       me.common.output(data);
                    });
                } catch (e) {
                   me.common.sendErrorJson('wrong path ' + p + '!');
                }
            }
        };

        me._get = () => {
            let p = req.params[0],
                mp = p.match(/\/([^\/]+)\/([^\/]+)(\/|$)/);
            if (mp) {
                switch (mp[2])  {
                    case 'renewToken':
                        me.renewToken((result) => {
                            res.send(result);
                        });
                        break;

                    case 'serverMem':
                        me.serverMem((result) => {
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

        me.post = () => {
            const METHODS = [
                'statusUpdate', 'removeGrid', 'addGrid', 'getGrids', 'getGridMatrix', 'gridAccess', 'syncAppCode', 'serverMem', 'sampleCode'
            ];
            if (METHODS.indexOf(req.body.cmd) === -1) {
               me.common.sendErrorJson('missing cmd!');
            } else {
                try {
                    me[req.body.cmd]((data) => {
                        me.common.output(data);
                    });
                } catch (e) {
                   me.common.sendErrorJson('wrong cmd ' + req.body.cmd + '!');
                }
            }
        };

        me._post = () => {
            if (typeof me[req.body.cmd] === 'function') {
                me[req.body.cmd]((result) => {
                    res.send(result);
                });
            } else {
                res.send({status:'failure', message : '404 wrong cmd ' + req.body.cmd + ' !'});
            }
        };
        /* --- GET function ---->> */
        me.renewToken = (callback) => {
            const oldToken = req.query.old;
            fs.readFile(gridTokenFn, 'utf-8', (err, gridoldToken) => {
               // if (gridToken !== oldToken) {
               //     callback('===');
               // } else {
                    const newToken = me.makeid(32);
                    fs.writeFile(gridOldTokenFn, gridoldToken, (err) => {
                        fs.writeFile(gridTokenFn, newToken, (err) => {
                            callback((err) ? '--niu--' : newToken);
                        });
                    });
               // }
            });
        }
    
        /* --- DATA function ---->> */

        me.gridTokenValidation = (gridToken, success) => {
            fs.readFile(gridTokenFn, 'utf-8', (err, data) => {

                if (data === gridToken) {
                    success();
                } else {
                    fs.readFile(gridOldTokenFn, 'utf-8', (err, dataOld) => {
                        if (dataOld === gridToken) {
                            success();
                        } else {
                           me.common.sendAction('', 'wrong authentication gridToken!');;
                        }
                    });
                }
            })
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
        me.dataGridMatrix = () => {
            try {

            } catch (e) {}
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids;
        }

        me.dataGrids = () => {
            let grids = {};
            try {
                grids = pkg.require(gridServerFn);
            } catch (e) {}
            return grids;
        }
        me.setCron = (code, str, callback) => {
            fs.writeFile(data_dir + '/commCron/' + code + '_' + new Date().getTime() + '.sh', str, function (err) {
                callback({status:'success'});
            });
        }
        /* --- POST function ---->> */
        me.removeGrid = (callback) => {
            var data = req.body;
            const _f = {};
            let gridServer = me.dataGrids();
            _f['removeGrid'] = (cbk) => {
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
                me.getGrids(callback);
            }, 3000)
        }

        me.addGrid = (callback) => {
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
                me.getGrids(callback);
            }, 3000)
        }

        me.getGrids = (cbk) => {
            cbk({status: "success", result: me.dataGrids()});
        }

        me.syncAppCode = (cbk) => {
            const shell_str = 'cd ' + git_root + ' && git pull';
            exec(shell_str, {maxBuffer: 224 * 2048},
                function(error, stdout, stderr) {
                    cbk({status : 'success'})
            });
        }

        me.sampleCode = (cbk) => {
            cbk({ij:'sampleCode3'})
        }

        me.getGridMatrix = (cbk) => {
            let grids = {}, resp = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {
            }

            for (let key in grids) {
                resp[key] = grids[key].mem;

            }
            cbk({status: 'success', result: resp});
        }
        me.gridAccess = (cbk) => {
            const data = req.body.data;
            cbk({gridServer : data.gridServer, token : pkg.md5(data.password)});
        }

        me.serverMem = (cbk) => {
            var info = {};
            fs.readFile('/proc/meminfo', {encoding : 'utf-8'}, (err, data) => {
                data.split(/\n/g).forEach(function(line){
                    line = line.split(':');
            
                    // Ignore invalid lines, if any
                    if (line.length < 2) {
                        return;
                    }
                    // Remove parseInt call to make all values strings
                    info[line[0]] = parseInt(line[1].trim(), 10);
                });
                return cbk(info);
            });
        }

        me.statusUpdate = (callback) =>{
           
            let grids = me.dataGridMatrix();
            let data = req.query;
            if (!data || !data.ip || !data.gridToken ) {
                callback(false);
                return true;
            } else {
                const _f = {};
                _f['newToken'] = (cbk) => {
                    const cmdStr = 'curl http://' + data.ip + ':10000/_grid/renewToken/?old=' + data.gridToken;
                    exec(cmdStr, {maxBuffer: 224 * 2048},
                        (error, stdout, stderr) => {
                            var v = (!stdout) ? '' : stdout.replace(/\s+/, '');
                            if ((error) || !v) {
                                cbk(false);
                              //  CP.exit = true;
                            } else {
                                cbk(v);
                            }
                    });
                }
                
                _f['memStatus'] = (cbk) => {
                    var ret = {};
                    if (req.body.data) {
                        req.body.data.split(/\n/g).forEach(function(line){
                            line = line.split(':');
                    
                            // Ignore invalid lines, if any
                            if (line.length < 2) {
                                return;
                            }
                            // Remove parseInt call to make all values strings
                            var k = line[0].replace(/(\{|\})/,'');
                            ret[k] = parseInt(line[1].trim(), 10);
                        });
                    }
                    cbk(ret);
                }
                _f['saveGridStatus'] = (cbk) => {
                    grids[data.ip] = {tm: new Date().getTime(), gridToken: CP.data.newToken, server: data.server, tag: data.tag,
                    mem : CP.data.memStatus};
                    fs.writeFile(gridStatusFn, JSON.stringify(grids), (err) => {
                        cbk(true);
                    });
                }
                
                CP.serial(_f, (data1) => {
                    const cmdStr = 'curl http://' + data.ip + ':10000/_grid/renewToken/?old=' + data.gridToken;
                    callback(cmdStr);
                    return true;
                   // callback(true);
                }, 3000)
            } 
        }
    }
    module.exports = obj;
})()