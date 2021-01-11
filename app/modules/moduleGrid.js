(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            CP = new pkg.crowdProcess(),
            data_dir = '/var/_localAppData',
            key_dir = '/var/_localAppKey',
            sitesCfgFn = data_dir + '/_servers_cfg.json',
            keyfn = key_dir + '/_grid.json';
            

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

                default:
                    res.send('wrong cmd ' + req.body.cmd);
                    break;        
            }
        };

        me.getGrids = () => {
            let grid = {};
            try {
                grid = pkg.require(keyfn);
            } catch (e) {}
            return grid;
        }

        me.getIp = () => {
            let grid = {};
            try {
                grid = pkg.require(keyfn);
            } catch (e) {}
            return grid;
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