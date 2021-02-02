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
                    me.validationPost(ip0);
                });
                
            } catch (e) {
               me.comm.sendErrorJson(e.message);
            }
            return true;
        }
        me.validationPost = (ip0) => {
            const authfn =  me.comm.file.authData;
            let auth = {}, authToken = {};
            try {
                auth = pkg.require(authfn);
            } catch (e) {
            }
            fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
                var setting = req.body;
               if (!setting || !setting.gridToken || (setting.gridToken != gridToken && auth.root !== setting.gridToken)) {
                   me.comm.sendAction('', 'Unauthorized gridToken!');
               } else {
                    const request = require('request');
                    var MAGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
                    let mGrid =  new MAGrid(env, pkg, req, res);
                    const grid = mGrid.dataGridMatrix(); 

                    setting.target = (setting.target) ? setting.target : ip0;

                    if  (setting.target === ip0 && (ip0) && setting.cmd === 'getGridMatrix') {
                        mGrid.call('post', true);
                    } else if (setting.target === ip0 && (ip0) && setting.cmd === 'askServerToken') {
                        me.comm.output({status: 'success', result:grid[setting.target].gridToken});
                    } else {
                        var postData =  setting;
                        
                        var channel = (!setting.channel) ? '_grid' : setting.channel;
                        let url = 'http://' + setting.target + ':10000/' + channel + '/';
                        postData.gridToken = grid[setting.target].gridToken;
            
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
    }
    module.exports = obj;
})()