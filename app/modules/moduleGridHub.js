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
            pkg.common.sendErrorJson('invalid access !');
            return true;
        };
        me.post = () => {
            try {
                me._post();
            } catch (e) {
                console.log('===> !' + e.message);
                pkg.common.sendErrorJson('===> !' + e.message);
            }
            
            return true;
        }
        me._post = () => {
            const authfn = '/var/_localAppData/authData.json';
            let auth = {}, authToken = {};
            try {
                auth = pkg.require(authfn);
            } catch (e) {}
            fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
                var setting = req.body;
               if (!setting || !setting.gridToken || (setting.gridToken != gridToken && auth.root !== setting.gridToken)) {
                    pkg.common.sendAction('', 'Unauthorized gridToken!');
               } else {
                    if (setting.cmd === 'askServerToken') {
                        res.send(me.askServerToken(setting));
                    } else if (setting.cmd === 'getGridMatrix') {
                        try {
                            var MAGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
                            let mGrid =  new MAGrid(env, pkg, req, res);
                            mGrid.call('post', true);
                        } catch (e) {
                            console.log('--niu1--->')
                        }
                        console.log('--niu0--->')
                    } else {
                        const request = require('request');
                        const grid = me.dataGridMatrix(); 
                        var postData =  setting;
                        let url = '';
                        var channel = (!setting.channel) ? '_grid' : setting.channel;
                        if (setting.target && grid[setting.target]) {
                            url = 'http://' + setting.target + ':10000/' + channel + '/';
                            postData.gridToken = grid[setting.target].gridToken;
                        } else {
                            url = 'http://' + setting.server + ':10000/' + channel + '/';
                        }
                        request.post({url: url, form: postData}, function(err,httpResponse,body){      
                            if (setting.type === 'json') {
                                res.send(body);
                            } else {
                                res.send(body);
                            } 
                        });
                    }
               }
            });
            return  true;
        };

        me.askServerToken  = (setting) => {
            const grid = me.dataGridMatrix();
            var result = {}
            if (!setting.target) {
                result = {status:'failuer', message: 'Missing setting.target!'};
            } else {
                var v = grid[setting.target];

                result = {status: 'success', ip : setting.target, serverToken  : v.gridToken};
            }
            return result;
        };

        me.dataGridMatrix = () => {
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids ;
        }


    }
    module.exports = obj;
})()