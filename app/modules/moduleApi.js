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
                'getIP'
            ];
            if (mp[2].indexOf(METHODS) === -1) {
                me.sendErrorJson();
            } else {
                try {
                    me[mp[2]]((data) => {
                        me.sendOutput(data);
                    });
                } catch (e) {
                    me.sendErrorJson();
                }
            }
        };

        me.post = () => {
            const methods = [
                'getIP'
            ];
            if (req.body.cmd.indexOf(METHODS) === -1) {
                me.sendErrorJson();
            } else {
                try {
                    me[req.body.cmd]((data) => {
                        me.sendOutput(data);
                    });
                } catch (e) {
                    me.sendErrorJson();
                }
            }
        };

        me.sendErrorJson = () => {
            res.send({status:'failure', message : '404 wrong path ' + p + ' !'});
        }
        me.sendOutput = (data) => {
            res.send(data);
        }    


        me.getGridMatrix = (data) => {
            res.send({status: 'success', result: me.dataGridMatrix()});
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
