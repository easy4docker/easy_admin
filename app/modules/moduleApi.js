(function() {
    var obj = function(env, pkg, req, res) {
        var me = this,
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
            const METHODS = [
                'getIP', 'getGridMatrix'
            ];
            if (METHODS.indexOf(mp[2]) === -1) {
                me.sendErrorJson(p);
            } else {
                try {
                    me[mp[2]]((data) => {
                        me.sendOutput(data);
                    });
                } catch (e) {
                    me.sendErrorJson(p);
                }
            }
        };

        me.post = () => {
            const methods = [
                'getIP'
            ];
            if (METHODS.indexOf(req.body.cmd) === -1) {
                me.sendErrorJson();
            } else {
                try {
                    me[req.body.cmd]((data) => {
                        me.sendOutput(data);
                    });
                } catch (e) {
                    me.sendErrorJson(req.body.cmd);
                }
            }
        };

        me.sendErrorJson = (p) => {
            res.send({status:'failure', message : '404 wrong path or cmd ' + p + ' !'});
        }
        me.sendOutput = (data) => {
            res.send(data);
        }    


        me.getGridMatrix = (cbk) => {
           cbk({status: 'success', result: me.dataGridMatrix()});
        }

        me.dataGridMatrix = () => {
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids;
        },
        me.getIP = (cbk) => {
            fs.readFile(data_dir+ '/_ip', 'utf-8', (err, data) => {
                cbk(data);
            });
        },
        me.getToken = () => {
            fs.readFile(gridTokenFn, 'utf-8', (err, data) => {
                res.send(data);
            });
        }
    }
    module.exports = obj;
})()
