(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            CP = new pkg.crowdProcess(),
            data_dir = '/var/_localAppData',
            key_dir = '/var/_localAppKey',
            sitesCfgFn = data_dir + '/_servers_cfg.json',
            keyfn = key_dir + '/_grid.json',
            gridServerFn = data_dir + '/_gridServers.json';
            
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
                        me.updateStatus(req.query.ip, () => {
                            res.send(true);
                        });
                        break;
                    case 'getIp':
                        res.send(me.getIp() ); 
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
                    me.saveGrid(req.query.ip, () => {
                        res.send(true);
                    });
                    break;
                case 'getGrids':
                    res.send(me.getGrids()); 
                    break;

                case 'addGrid':
                    me.addGrid(req.body); 
                    break;

                case 'removeGrid':
                    me.removeGrid(req.body); 
                    break;
                    
                default:
                    res.send('wrong cmd ' + req.body.cmd);
                    break;        
            }
        };
        me.getGrids = () => {
            let grids = {};
            try {
                grids = pkg.require(gridServerFn);
            } catch (e) {}
            return grids;
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
                let shell_str = 'echo "* * * * *  root (echo _EASY_GRID_SYNC && cd  ' + _env.app_root + ' && sh _gridSync.sh ' + 
                    encodeURIComponent(JSON.stringify(gridServer)) + ')" >> ';

                if (_env.env === 'local') {
                    shell_str += _env.data_folder + '/log/ctab';
                } else {
                    shell_str += '/etc/crontab';
                }
                fs.writeFile(data_dir + '/commCron/gridSync_' + new Date().getTime() + '.sh', shell_str, (err) => {
                    cbk(true);
                });
            }
            CP.serial(_f, (data) => {
                res.send(me.getGrids());
            }, 3000)

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
                let shell_str = 'echo "sed /\echo _EASY_GRID_SYNC/d" ' + shell_fn + ' > /tmp/crontab_easydocker &&  cp -f /tmp/crontab_easydocker  ' + shell_fn + '"';
                fs.writeFile(data_dir + '/commCron/gridRm_' + new Date().getTime() + '.sh', shell_str, (err) => {
                    cbk(true);
                });
            }
            CP.serial(_f, (data) => {
                res.send(me.getGrids());
            }, 3000)
        }

        me.getIp = () => {
            let grid = {};
            try {
                grid = pkg.require(keyfn);
            } catch (e) {}
            return grid;
        }

        this.setCron = (code, str, callback) => {
            fs.writeFile(data_dir + '/commCron/' + code + '_' + new Date().getTime() + '.sh', str, function (err) {
                setTimeout(() => {
                    callback({status:'success', message: code});
                }, 500)
            });

            /*
              echo "* * * * *  root (echo _EASY_DOCKER && cd  ${SCR_DIR} && sh _gridSync.sh)" >> /etc/crontab

            _f['removeCron'] = (cbk) => {
				let cmd = 'sed /' + data.fileName.replace(/[-\/\\^$*+?.()|[\]{}_]/g, '\\$&') + '/d /etc/crontab > /etc/tmp_crontab';
				cmd += ' && cp -f /etc/tmp_crontab /etc/crontab && rm /etc/tmp_crontab';

				const fnc = me.env.dataFolder + '/cron/xc_' + new Date().getTime() + '.sh';

				fs.writeFile(fnc, cmd, (errp) => {
					cbk(true);
				});
            }
        */
        }

        me.updateStatus = (ip, callback) => {
            let grid = me.getGrid();
            grid[ip] = new Date().getTime();
            fs.writeFile(keyfn, JSON.stringify(grid), (err) => {
				callback();
			});
        }
    }
    module.exports = obj;
})()