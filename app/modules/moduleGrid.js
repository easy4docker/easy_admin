(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            CP = new pkg.crowdProcess(),
            data_dir = '/var/_localAppData',
            key_dir = '/var/_localAppKey',
            sitesCfgFn = data_dir + '/_servers_cfg.json',
            keyfn = key_dir + '/_grid.json';
            

        me.call = () => {
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
                    res.send('wrong path');
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

        me.saveGrid = (ip, callback) => {
            let grid = me.getGrid();
            grid[ip] = new Date().getTime();
            fs.writeFile(keyfn, JSON.stringify(grid), (err) => {
				callback();
			});
        }
    }
    module.exports = obj;
})()