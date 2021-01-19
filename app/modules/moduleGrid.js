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
            res.send('===uuu===');
            return true;
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

        me.post = () => {
            if (typeof me[req.body.cmd] === 'function') {
                me[req.body.cmd](req.body, (result) => {
                    res.send(result);
                });
            } else {
                res.send({status:'failure', message : '404 wrong cmd ' + req.body.cmd + ' !'});
            }
        };

        me.sampleCode = (dt, cbk) => {
            cbk({ij:'sampleCode3'})
        }

        me.getGridMatrix = (dt, cbk) => {
            cbk({status: 'success', result: me.dataGridMatrix()});
        }

        me.dataGridMatrix = () => {
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids;
        }
    }
    module.exports = obj;
})()