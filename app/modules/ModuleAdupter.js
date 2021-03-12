(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            CP = new pkg.crowdProcess(),
            data_dir = '/var/_localAppData',
            key_dir = '/var/_localAppKey',
            sitesCfgFn = data_dir + '/_servers_cfg.json';

        this.getSiteConfig = (serverName) => {
            var v = {}, p;
            try {
                var p = pkg.require(sitesCfgFn);
                if (typeof p == 'object') {
                    v = p;
                }
            } catch (e) {}
            var cfg = v[serverName];
            return cfg;
        }

        this.call = () => {
            let p = req.url;
            let mp = p.match(/\/([^\/]+)\/([^\/]+)\/(ui|api)\/(.+|$)/);
            if (!mp) {
                callback({ error : {
                    message: 'Unacceptable uri ' + p
                }});
            } else {
                me.dockerEnv = {};
                
                try {
                    me.dockerEnv = pkg.require(data_dir + '/_env.json');
                } catch (e) {}
                try {
                    me.dockerEnv.rootKey = pkg.require(key_dir + '/' + mp[2] + '/key.json');
                } catch (e) {}
                const pluginEnv = {
                    root : data_dir + '/' + mp[1] + '/' + mp[2]
                }
               const pluginFn = data_dir + '/' + mp[1] + '/' + mp[2] + '/code/dockerSetting/adupter/' + mp[3] + '/' + mp[4];
                
                me.dockerEnv.siteConfig = me.getSiteConfig(mp[2]);
                if (mp[3] === 'ui') {
                    fs.stat(pluginFn, function(err, stat) {
                        if(err == null) {
                            fs.readFile(pluginFn, (err, data)=> {
                                me.sendHeader('js');
                                res.send(data);
                            });
                        } else {
                            let fn = pluginFn.split('/').pop().split('#')[0].split('?')[0];
                            res.send(fn + ' does not exist!');
                        }
                    });
                } else {
                    var dockerPLUG= pkg.require(pluginFn);
                    var plugObj = new dockerPLUG(pluginEnv);
                    plugObj.call(req.body, (data) => {
                        res.send(data);
                    });     
                }
            }
        },
        this.sendHeader = (filetype) => {
            var me = this;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header('Access-Control-Allow-Headers', 'Content-Type'); 
            if (filetype === 'js' || filetype === 'jsx' || filetype === 'vue') {
                res.setHeader('Content-Type', "text/javascrip");
            } else if (filetype == 'css') {
                me.is_css = true;
                res.setHeader('Content-Type', "text/css");
            } else {
                res.setHeader('Content-Type', "text/plain");
            }			
        }
    }
    module.exports = obj;
})()
