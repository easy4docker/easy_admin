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

        me.post = () => {
			if (typeof me[req.body.cmd] === 'function') {
				me[req.body.cmd](req.body);
			} else {
                res.send({status:'failure', message : '404 wrong cmd ' + req.body.cmd + ' !'});
			}

        };

        me.get = () => {
            let p = req.params[0],
                mp = p.match(/\/([^\/]+)\/([^\/]+)(\/|$)/);
			try {
                me[mp[2]]();
            } catch (e) {
                res.send({status:'failure', message : '404 wrong path ' + p + ' !'});
			}
        };

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
        me.getIP = () => {
            fs.readFile(data_dir+ '/_ip', 'utf-8', (err, data) => {
                res.send(data_dir+ '/_ip');
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
