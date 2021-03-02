const { cpuUsage } = require('process');

(function() {
    var obj = function(env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();
        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}

        me.runUpload = () => {
            const dirn = req.body.objPath;
            exec('mkdir -p ' + dirn, () =>{
                exec('mv ' + req.files[0].path + ' ' + dirn, () =>{
                    res.send(req.files);
                });
                
            })
        }
    }
    module.exports = obj;
})()
