(function() {
    var obj = function(env, pkg, req, res) {
        const me = this,
            fs = require('fs'),
            CP = new pkg.crowdProcess(),
            data_dir = '/var/_localAppData',
            key_dir = '/var/_localAppKey',
            sitesCfgFn = data_dir + '/_servers_cfg.json';

        me.call = () => {
            fs.readFile(data_dir + '/ip', 'utf-8', (err, data)=> {
                res.send(data);
            });    
            
        }
    }
    module.exports = obj;
})()
