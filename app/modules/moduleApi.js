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
            gridStatusFn = data_dir + '/_gridMatrix.json';

		var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}

        me.call = (rest, bypassLocalAuth) => {
            if (!bypassLocalAuth) {
                var token = (req.query.authToken) ? req.query.authToken : (req.body.authToken) ? req.body.authToken : '';
                me.localTokenValidation(
                    token, me[rest]
                );
            } else {
                me.comm.sendAction('', 'wrong authentication token!');
            }
        }
        
        me.get = () => {
            let p = req.params[0],
                mp = p.match(/\/([^\/]+)\/([^\/]+)(\/|$)/);
            const METHODS = [
                'getIP', 'getGridMatrix', 'getToken'
            ];
            if (METHODS.indexOf(mp[2]) === -1) {
               me.comm.sendErrorJson('wrong path ' + p + '!');
            } else {
                try {
                    me[mp[2]]((data) => {
                       me.comm.output(data);
                    });
                } catch (e) {
                   me.comm.sendErrorJson('wrong path ' + p + '!');
                }
            }
        };

        me.post = () => {
            const METHODS = [
                'getIP', 'getGridMatrix'
            ];
            if (METHODS.indexOf(req.body.cmd) === -1) {
               me.comm.sendErrorJson('missing cmd!');
            } else {
                try {
                    me[req.body.cmd]((data) => {
                       me.comm.output(data);
                    });
                } catch (e) {
                   me.comm.sendErrorJson('wrong cmd ' + req.body.cmd + '!');
                }
            }
        };

        me.localTokenValidation = (token, success) => {
            let authToken = {};
            try {
                authToken = pkg.require(me.comm.file.authToken );
            } catch (e) {}
            for (var o in authToken) {
                if (new Date().getTime() - authToken[o] > me.comm.SESSION_TIMEOUT) {
                   delete authToken[o];
                }
            }
            if (authToken[token]) {
                authToken[token] = new Date().getTime();
                fs.writeFile(me.comm.file.authToken, JSON.stringify(authToken), 
                (err) => {
                    success();
                });
            } else {
                me.comm.sendAction('', 'wrong authentication token!');
            }
        }
        /*
        me.getGridMatrix = (cbk) => {
           cbk({status: 'success', result: me.dataGridMatrix()});
        }

        me.dataGridMatrix = () => {
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids;
        }
*/
        me.getIP = (cbk) => {
            fs.readFile(data_dir+ '/_ip', 'utf-8', (err, data) => {
                cbk(data);
            });
        }
        
        me.getToken = (cbk) => {
            fs.readFile(me.comm.file.authToken, 'utf-8', (err, data) => {
                cbk(data);
            });
        }
    }
    module.exports = obj;
})()
