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
                const _f = {};
                for (let i = 0; i < req.files.length; i++) {
                    _f['S_' + i] = ((i)=> {
                        return (cbk) => {
                            exec('mv -f ' + req.files[i].path + ' ' + dirn + '/' + req.files[i].originalname, 
                                {maxBuffer: 224 * 2048},
                                (error, stdout, stderr) =>{
                                    cbk(true);
                                });                  
                        }
                    })(i)
                }
                CP.serial(_f, (result) => {
                    res.send(req.files);
                }, 3000);                
            })
        }
    }
    module.exports = obj;
})()
