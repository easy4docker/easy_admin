const { cpuUsage } = require('process');

(function() {
    var obj = function(env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}

        me.runGridUpdate = () => {
            fs.readFile(env.dataFolder  + '/_ip', 'utf-8',
                function(err, ipData) {
                    const ip = ipData.replace(/(\n|\r)/ig, '')
                    const gridStatusFn = me.comm.file.gridStatus;
                    pkg.readJson(gridStatusFn, (grids) => {
                        let valid = false;
                        if (ip === 'localhost') {
                            valid = true;
                        } else {
                            for (var o in grids) {
                                if (grids[o].gridToken === req.body.gridToken) {
                                    valid = true;
                                    break;
                                }
                            }
                        }
                        if (!valid) {
                            res.send({status:'failure', message : 'authentication failure!'});
                            return true;
                        }
                        const dirn = req.body.objPath;
                        var cmd = 'mkdir -p ' + dirn;
                        exec(cmd, () =>{
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
                        });
                    });
            });

        }
        me.fileUpload = () => {
            const uploadID = (req.body.uploadID) ? req.body.uploadID : new Date().getTime();
            let files = (!req.files) ? [] : req.files, 
                flist = [],
                targetDir = 'fileUpload/D_' + uploadID,
                movetoDir = env.sitesSharedFolder + '/' + ((req.body.movetoDir) ? req.body.movetoDir : targetDir) + '/input',
                cmd = 'mkdir -p ' + movetoDir + '';
       
            for (var i = 0; i < files.length; i++) {
                const fname = movetoDir + '/' +  (files[i].originalname.replace('F_' + uploadID + '_', ''));
                flist.push(fname);
                cmd += ((cmd) ? ' && ' : '') + 'mv ' + files[i].path + ' ' + fname;
            }
            cmd += ' && echo "' + movetoDir  + '" > /tmp/test.txt';
            if (cmd) {
                exec(cmd, {maxBuffer: 224 * 2048}, (err, stdout, stderr) => {
                    res.send({status: 'success', uploadID: uploadID, movetoDir:movetoDir, files : flist});
                })
            } else {
                res.send({status: 'failure', message : 'nothing uploaded!'});
            }

        }
    }
    module.exports = obj;
})()
