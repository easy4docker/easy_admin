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
            res.send(req.query);
            return true;
        };

        me.post = () => {
            fs.readFile(gridTokenFn, 'utf-8', (err, gridToken) => {
               // if ((!setting || !setting.gridToken || setting.gridToken != gridToken) && req.hostname !== 'localhost' && setting.cmd !== 'getGridMatrix') {
               if ((!setting || !setting.gridToken || setting.gridToken != gridToken) && req.hostname !== 'localhost' && setting.cmd !== 'getGridMatrix') {
                    res.send({status:'failuer', message: 'Unauthorized gridToken!'});
               } else {
                    var setting = req.body;

                    const request = require('request');
                    let server = (/^localhost/ig.test(setting.server)) ? 'localhost' : (setting.server + ':10000');
    

                    var dataGridMatrix = me.dataGridMatrix();

                    /*
                    if (!dataGridMatrix[server] && server != 'grid.shusiou.win') {
                        res.send({status:'failuer', message: 'gridHub refused unauthorized server ' + server + '!'});
                    } else if (setting.cmd === 'gridHub') {
                        res.send({status:'failuer', message: 'gridHub can not hub route itself!'});
                    } else {
                    */
                        server = (/^http\:\/\//.test(server)) ? server : ('http://' + server)
                        var channel = (!setting.channel) ? '_grid' : setting.channel;
                        request.post({url: server + '/' + channel + '/', form: setting}, function(err,httpResponse,body){      
                            if (setting.type === 'json') {
                               // var result = {};
                               // try { result = JSON.parse(body);} catch (e) {}   
                               res.send(body);
                            } else {
                                res.send(body);
                            } 
                        });
                      
                   // }
               }
            });
            return  true;
        };

        me.dataGridMatrix = () => {
            let grids = {};
            try {
                grids = pkg.require(gridStatusFn);
            } catch (e) {}
            return grids;
        }
    }
    module.exports = obj;
})()