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
            // res.send('===uuu===');
            // return true;
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
                        res.send('===uuu1===');
                        break;
                    case 'getGridMatrix':
                        res.send('===uuu2===');
                        break;
                    case 'gridHub':
                        res.send('===uuu3===');
                        break;
                    /*    
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
                    */        
                    default:
                        res.send('wrong path ' + p);
                        break;        
                }
            } else {
                res.send('wrong path');
            }
            
        };

        me.post = () => {
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
        /* --- DATA function ---->> */
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
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids;
        }

        /* --- POST function ---->> */
        me.sampleCode = (cbk) => {
            cbk({ij:'sampleCode3'})
        }

        me.getGridMatrix = (cbk) => {
            cbk({status: 'success', result: me.dataGridMatrix()});
        }


        me.gridAccess = (cbk) => {
            const data = req.body.data;
            cbk({gridServer : data.gridServer, token : pkg.md5(data.password)});
        }
    }
    module.exports = obj;
})()