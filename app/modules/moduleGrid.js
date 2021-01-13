(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            app_dir = '/var/_localApp',
            data_dir = '/var/_localAppData',
            key_dir = '/var/_localAppKey',
            gridStatusFn = app_dir + '/_grid.json',
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
                    default:
                        res.send('wrong path');
                        break;        
                }
            } else {
                res.send('wrong path');
            }
            
        };

        me.post = () => {
            switch (req.body.cmd)  {
                case 'updateStatus':
                    me.updateStatus(req.query, (result) => {
                        res.send(result);
                    });
                    break;
                case 'getGrids':
                    res.send(req.body);
                 //   res.send(me.getGrids()); 
                    break;

                case 'addGrid':
                    me.addGrid(req.body); 
                    break;

                case 'removeGrid':
                    me.removeGrid(req.body); 
                    break;
                    
                case 'syncAllCode':
                    res.send(req.body);
                        // me.removeGrid(req.body); 
                    break;

                default:
                    res.send('wrong cmd ' + req.body.cmd);
                    break;        
            }
        };


        me.getGridStatus = () => {
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids;
        }
        me.updateStatus = (data, cbk) => {
            var grids = me.getGridStatus();
            if (data.ip) {
                grids[data.ip] = {tm: new Date().getTime(), token: data.token, server: data.server, tag: data.tag};
                fs.writeFile(gridStatusFn, JSON.stringify(grids), (err) => {
                    cbk(true);
                });
            } else {
                cbk(false);
            }
        }

        me.getGrids = () => {
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
        me.addGrid = (data) => {
            const _f = {};

            let gridServer = me.getGrids();
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
                res.send(me.getGrids());
            }, 3000)

        }
        //------
        me.syncAppCode = () => {
            const shell_str = 'cd ' + _env.app_root + '/admin && git pull';
            me.setCron('grid_git_pull', shell_str, (err) => {
                res.send({status : 'success'})
            });
        }
        me.removeGrid = (data) => {
            const _f = {};
            let gridServer = me.getGrids();
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
                res.send(me.getGrids());
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