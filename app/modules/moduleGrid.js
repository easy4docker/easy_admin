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
            gridServerFn = key_dir + '/_gridServers.json';
            
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
                        me.updateStatus(req.query, (result) => {
                            res.send(result);
                        });
                        break;

                    case 'getGridMatrix':
                        me.getGridMatrix();
                        break;

                    case 'gridHub':
                        me.gridHub(req.query);
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
            if (typeof me[req.body.cmd] === 'function') {
                me[req.body.cmd](req.body.setting);
            } else {
                res.send({status:'failure', message : '404 wrong cmd ' + req.body.cmd + ' !'});
            }
        };

        me.gridHub = (setting) => {
            if (!setting || !setting.server || !setting.cmd) {
                res.send({status:'failuer', message: 'missing server or/and cmd'});
            } else {
                var request = require('request');
                var server = (/^localhost/ig.test(setting.server)) ? 'localhost' : setting.server;
                request.post({url: server + '/_api/', form: setting}, function(err,httpResponse,body){     
                    if (setting.type === 'json') {
                        var result = {};
                        try { result = JSON.parse(body);} catch (e) {}   
                        res.send(result);
                    } else {
                        res.send(body);
                    } 
                });
            }
        }
        // ---- get related ---->
       
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

        me.updateStatus = (data, cbk) => {
            var grids = me.dataGridMatrix();
            if (data.ip) {
                grids[data.ip] = {tm: new Date().getTime(), token: data.token, server: data.server, tag: data.tag};
                fs.writeFile(gridStatusFn, JSON.stringify(grids), (err) => {
                    cbk(true);
                });
            } else {
                cbk(false);
            }
        }
        // <---- get related ---->
        me.getGrids = () => {
            res.send(me.dataGrids());
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
            _f['addToCron'] = (cbk) => {
                let shell_str = 'echo "*/5 * * * *  root (echo _EASY_GRID_SYNC && cd  ' + _env.app_root + ' && sh _gridSync.sh ' + 
                    data.gridServer + ' ' + data.tag + ' ' + me.makeid(32) + ')" >> ';

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
        //------
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

        this.setCron = (code, str, callback) => {
            fs.writeFile(data_dir + '/commCron/' + code + '_' + new Date().getTime() + '.sh', str, function (err) {
                callback({status:'success'});
            });
        }
    }
    module.exports = obj;
})()