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
            res.send({status:'failure', message : '500 invalid access !'});
            return true;
        };

        me.post = () => {
            fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
                var setting = req.body;
               // if ((!setting || !setting.gridToken || setting.gridToken != gridToken) && req.hostname !== 'localhost' && setting.cmd !== 'getGridMatrix') {
               if (!setting || !setting.gridToken) {
                    res.send({status:'failuer', message: 'Unauthorized gridToken!'});
               } else {
                    const request = require('request');
                    const grid = me.dataGridMatrix(); 
                    var postData =  setting;
                    let url = '';
                    var channel = (!setting.channel) ? '_grid' : setting.channel;
                    if (setting.target && grid[setting.target]) {
                        url = 'http://' + setting.target + ':10000/' + channel + '/';
                        // postData.gridToken = grid;
                        postData.gridToken = grid[setting.target].gridToken;
                    } else {
                        url = 'http://' + setting.server + ':10000/' + channel + '/';
                      //  url = 'http://' + ((/^localhost/ig.test(setting.server)) ? 'localhost/' : (setting.server + ':10000/')) + channel + '/';
                        // postData.gridToken = grid;
                    }
                    // res.send(grid);
                    // return true;
                //    let server = (/^localhost/ig.test(setting.server)) ? 'localhost' : (setting.server + ':10000');
                //    server = (/^http\:\/\//.test(server)) ? server : ('http://' + server)
                    
 
                    request.post({url: url, form: postData}, function(err,httpResponse,body){      
                        if (setting.type === 'json') {
                            // var result = {};
                            // try { result = JSON.parse(body);} catch (e) {}   
                            res.send(body);
                        } else {
                            res.send(body);
                        } 
                    });
               }
            });
            return  true;
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