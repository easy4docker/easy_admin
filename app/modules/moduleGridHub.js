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
            pkg.readJson(authfn, (auth) => {
                fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
                    var setting = req.body;
                    me.comm.sendAction('', 'Unauthorized gridToken!->' + auth.root + '==' + setting.gridToken);
                    return true;
                   if (!setting || !setting.gridToken || (setting.gridToken != gridToken && auth.root !== setting.gridToken)) {
                       me.comm.sendAction('', 'Unauthorized gridToken!->' + auth.root + '==' + setting.gridToken);
                   } else {
                        const request = require('request');
                        var MAGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
                        let mGrid =  new MAGrid(env, pkg, req, res);
                        mGrid.dataGridMatrix((grid) =>{
                            setting.target = (setting.target) ? setting.target : ip0;
                            if  (setting.cmd === 'getGridMatrix' || setting.cmd === 'getServerToken') {
                                mGrid.call('post', true);
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
                   }
                });
            });
            return  true;
        };
    }
    module.exports = obj;
})()