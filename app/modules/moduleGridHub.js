(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs');

        var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        const   gridTokenFn = me.comm.file.gridToken;

        me.get = () => {
           me.comm.sendErrorJson('invalid access !');
            return true;
        };
        me.post = (bypassAuth) => {
            try {
                fs.readFile(me.comm.inside.data+ '/_ip', 'utf-8', (err, ip0) => {
                    me.validationPost(ip0, bypassAuth);
                });
                
            } catch (e) {
               me.comm.sendErrorJson(e.message);
            }
            return true;
        }
        me.execGridPost = (setting, ip0) => {
            const request = require('request');
            var MAGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
            let mGrid =  new MAGrid(env, pkg, req, res);

            mGrid.dataGridMatrix((grid) =>{
                setting.target = (setting.target) ? setting.target : ip0;
                if  (setting.cmd === 'getGridMatrix' || setting.cmd === 'getServerToken') {    
                    mGrid[setting.cmd]((result) =>{
                        me.comm.output(result);
                    });
                } else {
                    var postData =  setting; 
                    var channel = (!setting.channel) ? '_grid' : setting.channel;
                    let url = 'http://' + setting.target + ':10000/' + channel + '/';

                    if (setting.target) {
                        postData.gridToken = (grid[setting.target]) ? grid[setting.target].gridToken : '';
                    } 
                    if (!setting.target || !postData.gridToken) {
                        res.send({status : 'failure', message : 'missing target'});
                    } else {
                        request.post({url: url, form: postData}, function(err,httpResponse,body){    
                            if (err) {
                                res.send({status : 'failure', message : err.message});
                            } else {
                                if (setting.type === 'json') {
                                    res.send(body);
                                } else {
                                    res.send(body);
                                } 
                            }
                        });
                    }
                }
            });
            return  true;
        };
        me.validationPost = (ip0, bypassAuth) => {
            var setting = req.body;
            if (!bypassAuth) {
                const authfn =  me.comm.file.authData;
                pkg.readJson(authfn, (auth) => {
                    fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
                        if (!setting || !setting.gridToken || (setting.gridToken != gridToken && auth.root !== setting.gridToken)) {
                            me.comm.sendAction('', 'Unauthorized gridToken!');
                        } else {
                            me.execGridPost(setting.data, ip0);
                        }
                    });
                });
            } else {
                me.execGridPost(setting.data, ip0);
            }
        };
    }
    module.exports = obj;
})()