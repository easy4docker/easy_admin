(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs');

        var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        const   gridTokenFn = me.comm.file.gridToken,
                gridStatusFn = me.comm.file.gridStatus;

        me.get = () => {
           me.comm.sendErrorJson('invalid access !');
            return true;
        };
        me.post = () => {
            try {
                fs.readFile(me.comm.inside.data+ '/_ip', 'utf-8', (err, ip0) => {
                    me._post(ip0);
                });
                
            } catch (e) {
               me.comm.sendErrorJson(e.message);
            }
            
            return true;
        }
        me.getIP = (cbk) => {
            fs.readFile(me.comm.inside.data+ '/_ip', 'utf-8', (err, data) => {
                cbk(data);
            });
        }
        me._post = (ip0) => {
            const authfn =  me.comm.file.authData;
            let auth = {}, authToken = {};
            try {
                auth = pkg.require(authfn);
            } catch (e) {
            }
            fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
                var setting = req.body;
               if (!setting || !setting.gridToken || (setting.gridToken != gridToken && auth.root !== setting.gridToken)) {
                   me.comm.sendAction('', 'Unauthorized gridToken!-');
               } else {
                    const request = require('request');
                    var MAGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
                    let mGrid =  new MAGrid(env, pkg, req, res);
                    const grid = mGrid.dataGridMatrix(); 
                    
                    if (setting.cmd === 'getGridMatrix') {
                        try {
                            // res.send({status: 'success', result : grid});
                            // var MAGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
                            //let mGrid =  new MAGrid(env, pkg, req, res);
                            mGrid.call('post', true);
                        } catch (e) {}
                    } else {
                        setting.target = (setting.target) ? setting.target : ip0;
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
            var MAGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
            let mGrid =  new MAGrid(env, pkg, req, res);
           // mGrid.call('post', true);
            const grid = mGrid.dataGridMatrix();
            // const grid = me.dataGridMatrix();
            var result = {}
            if (!setting.target) {
                result = {status:'failuer', message: 'Missing setting.target!'};
            } else {
                var v = grid[setting.target];

                result = {status: 'success', ip : setting.target, serverToken  : v.gridToken};
            }
            return result;
        };

        me.dataGridMatrixBK = () => {
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids ;
        }


    }
    module.exports = obj;
})()