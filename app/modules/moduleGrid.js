(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        const   gridTokenFn = me.comm.file.gridToken,
                gridOldTokenFn = me.comm.file.gridOldToken,
                gridStatusFn = me.comm.file.gridStatus,
                gridServerFn = me.comm.file.gridServer;

        me.call = (rest, bypassGridAuth) => {
            if (req.body.cmd === 'statusUpdate' || bypassGridAuth) {
                me[rest]();
            } else {
                var gridToken = (req.query.gridToken) ? req.query.gridToken : (req.body.gridToken) ? req.body.gridToken : '';
                me.gridTokenValidation(gridToken, me[rest]);
            }
        }

        me.get = () => {
            let p = req.params[0],
            mp = p.match(/\/([^\/]+)\/([^\/]+)(\/|$)/);
            const METHODS = [
                'renewToken', 'serverMem', 'getEnv', 'getGridMatrix'
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
                'statusUpdate', 'getGridMatrix', 'gridAccess', 'serverMem',
                'setupServer'
            ];

            var MApi= pkg.require(env.root+ '/modules/moduleApi.js');
            let api =  new MApi(env, pkg, req, res);

            if (METHODS.indexOf(req.body.cmd) === -1 && !api[req.body.cmd]) {
               me.comm.sendErrorJson('missing cmd ' + req.body.cmd + '!');
            } else {
                try {
                    if (api[req.body.cmd]) {
                        api[req.body.cmd]((data) => {
                            me.comm.output(data);
                        });
                    } else {
                        me[req.body.cmd]((data) => {
                            me.comm.output(data);
                        });
                   }

                } catch (e) {
                   me.comm.sendErrorJson('wrong cmd ' + req.body.cmd + '!');
                }
            }
        };

        /* --- GET function ---->> */
        me.renewToken = (callback) => {
            const oldToken = req.query.gridToken;
            fs.readFile(gridTokenFn, 'utf-8', (err, gridoldToken) => {
               // if (gridToken !== gridoldToken) {
               //     callback('===');
               // } else {
                    const newToken = me.makeid(32);
                    fs.writeFile(gridOldTokenFn, oldToken, (err) => {
                        fs.writeFile(gridTokenFn, newToken, (err) => {
                            callback((err) ? '' : newToken);
                        });
                    });
               // }
            });
        }
        me.getEnv = (callback) => {
            callback(me.comm.outside);
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
                           me.comm.sendAction('', 'wrong authentication gridToken!');;
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
        me.dataGridMatrix = (cbk) => {
            pkg.readJson(gridStatusFn, (grids) => {
                cbk(grids);
            });
        }

        me.setCron = (code, str, callback) => {
            fs.writeFile(me.comm.inside.data + '/commCron/' + code + '_' + new Date().getTime() + '.sh', str, function (err) {
                callback({status:'success'});
            });
        }
        /* --- POST function ---->> */

        me.getGridMatrix = (cbk) => {
            pkg.readJson(gridStatusFn, (grids) => {
                let resp = {}
                for (let key in grids) {
                    resp[key] = grids[key].mem;
                }
                cbk({status: 'success', result: resp});
            });
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

            me.dataGridMatrix((grids) => {
                let data = req.body;
                if (!data || !data.ip || !data.gridToken ) {
                    callback({status: 'failure', result: 'Missing gridToken, ip or wrong data!'});
                    return true;
                } else {
                    const _f = {};
                    _f['newToken'] = (cbk) => {
                        const cmdStr = 'curl http://' + data.ip + ':10000/_grid/renewToken/?gridToken=' + data.gridToken;
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
                        var ret = {}, dt = {};
                        
                        if (req.body.data) {
                            dt = req.body.data.split('|');
                            dt.forEach(function(line){
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
                    _f['removeOvertime'] = (cbk) => {
                        for (o in grids) {
                            if (new Date().getTime() - grids[o].tm > 300000) {
                                delete grids[o];
                            }
                        }
                        cbk(true);
                    }
                    _f['saveGridStatus'] = (cbk) => {
                        grids[data.ip] = {tm: new Date().getTime(), gridToken: CP.data.newToken, server: data.server, tag: data.tag,
                        mem : CP.data.memStatus};
                        fs.writeFile(gridStatusFn, JSON.stringify(grids), (err) => {
                            cbk(true);
                        });
                    }
                    
                    CP.serial(_f, (dataCP) => {
                        callback(dataCP);
                    }, 3000)
                } 
            });
        }
    }
    module.exports = obj;
})()