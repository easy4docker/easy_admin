const { eventNames } = require('process');

(function() {
    var obj = function(env) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js');

        me.siteCommCronMark = env.dataFolder + '/siteCommCronMark.txt';
        me.siteCommCronFn = '';
       

        me.onDemand = (onDemandCode, cbk) => {
            console.log('');
            console.log('Running ... ' + onDemandCode);
            const onDemandObj = onDemandCode.split('/data/onDemand/');
            me.readJson(env.dataFolder + '/sites/' + onDemandCode, (onDemandData) => {
                if (typeof me[onDemandData.code] === 'function' && onDemandObj.length === 2) {
                    const param = onDemandData.param;
                    param.requestId = onDemandData.requestId;
                    param.uploadId = onDemandData.uploadId;
                    console.log(onDemandData);
                    me[onDemandData.code](onDemandObj[0], param, () => {
                        fs.unlink(env.dataFolder + '/sites/' + onDemandCode, cbk);
                    });
                } else {
                    console.log('wrong ondemand code =>' + onDemandData.code);
                }
                
            });
        }

        me.onDemandA = (server, file, cbk) => {
            fs.stat(me.siteCommCronMark, function(err, stat) {
                if (err && err.code === 'ENOENT') {
                    me.siteCommCronFn = env.dataFolder + '/sites/' + server + '/data/commCron/' + file;
                    console.log('===>>>-------' + me.siteCommCronFn);
                    fs.writeFile(me.siteCommCronMark, me.siteCommCronFn, () => {
                        me.readJson(me.siteCommCronFn, (data) => {
                            if (typeof me[data.code] === 'function') {
                                console.log('function =>>: ' + data.code);
                                me[data.code](server, data.param, cbk);
                            } else {
                                me.removeMark(() => {
                                    console.log('clean siteCommCronMark =>' + me.siteCommCronFn);
                                })
                                
                            }
                        });
                    });
                } else {
                    let delta = new Date().getTime() - ((!stat || !stat.mtime) ? 0 : new Date(stat.mtime).getTime());
                    // remove me.siteCommCronMark if longer than 59s
                    if (delta > 59000) {
                        /*
                        fs.unlink(me.siteCommCronMark, () => {
                            console.log('removed ... ' +  file);
                        });*/
                        
                    } else {
                        console.log('skipped and continuing ... ' +  file);
                    }
                }
            });
        }
        me.removeMark = (cbk) => {
            exec('rm -fr ' + me.siteCommCronFn + ' && rm -fr ' + me.siteCommCronMark, {maxBuffer: 224 * 2048}, (error, stdout, stderr) => {
                cbk();
            });
        }

        me.serverStatus = (callback) => {
            const _f = {};
            _f['_env'] = (cbk)=> {
                var fn = env.dataFolder + '/_env.json';
                me.readJson(fn, (data) => {
                    cbk(data)
                });
            }
            _f['localIp'] = (cbk)=> {
                var fn = env.dataFolder + '/_ip';
                fs.readFile(fn, 'utf-8', (err, data) => {
                    cbk((err) ? '' : data);
                });
                
            }

            _f['gridMatrix'] = (cbk)=> {
                var fn = env.keyFolder + '/_gridMatrix.json';
                me.readJson(fn, (data) => {
                    cbk(data)
                });
                
            }

            _f['gridServer'] = (cbk)=> {
                var fn = env.dataFolder + '/_GRID_SERVER';
                fs.readFile(fn, 'utf-8', (err, data) => {
                    cbk((err) ? '' : data);
                });                
            }

            _f['gridToken'] = (cbk)=> {
                var fn = env.keyFolder + '/_gridToken';
                fs.readFile(fn, 'utf-8', (err, data) => {
                    cbk((err) ? '' : data);
                });
                
            }

            _f['gridOldToken'] = (cbk)=> {
                var fn = env.keyFolder + '/_gridOldToken';
                fs.readFile(fn, 'utf-8', (err, data) => {
                    cbk((err) ? '' : data);
                });
                
            }

            _f['authToken'] = (cbk)=> {
                var fn = env.keyFolder + '/authToken.json';
                me.readJson(fn, (data) => {
                    let token = '';
                    try {
                        token = Object.keys(data)[0];
                    } catch (e) {}
                    cbk(token)
                });
                
            }
            _f['resources'] = (cbk) => {
                const gridMatrix = cp.data.gridMatrix;
                const ip = cp.data.ip;
                const resources = {recommend:[], self:{}, avaliable:[]};
                
                for (o in gridMatrix) {
                    if (o !== cp.data.localIp) {
                        resources.recommend.push({server:o, authToken : gridMatrix[o].gridToken});
                    }
                    resources.avaliable.push({server:o, authToken : gridMatrix[o].gridToken});
                }
                resources.self = {server:'local', authToken : cp.data.authToken};
                cbk(resources);
            }

            const cp = new CP();
            cp.serial(_f, (data) => {
                callback({
                    _env        : cp.data._env,
                    localIp     : cp.data.localIp,
                    gridMatrix  : cp.data.gridMatrix,
                    gridServer : cp.data.gridServer,
                    gridToken   : cp.data.gridToken,
                    gridOldToken: cp.data.gridOldToken,
                    authToken   : cp.data.authToken,
                    resources   : cp.data.resources
                });
            }, 3000);   
        }
        me.removeMe = (server, param, callback) => {
            me.serverStatus((sts)=> {
                const postData = "'" + JSON.stringify({
                    cmd:'deleteVServer',
                    data : {serverName : server},
                    authToken: sts.authToken
                }) + "'";
                var cmd = 'curl -d ' + postData +
                    '  -H "Content-Type: application/json" -X POST localhost/api/';
                exec(cmd, {maxBuffer: 224 * 2048},
                    function(error, stdout, stderr) {
                        var jdata = {};
                        try {
                        jdata = JSON.parse(stdout);
                        } catch (e) {}
                        me.removeMark(() => {
                            console.log(jdata);
                        });
                });
            });
        }

        me.siteShareFolder = (serverName) => {
            const serverCode = serverName.replace(/\_([0-9]+)$/, '');
            const folderName = (!req.body.data || !req.body.data.superPower) ?  serverName: 
                req.body.data.superPower.server + '/' + serverCode +  '_' + req.body.data.superPower.host + '_' + new Date().getTime();
            return _env.data_folder + '/sitesShareFolder/' + folderName;
        }

        me.addOndemand = (server, param, callback) => {
            fs.readFile(env.dataFolder  + '/_ip', 'utf-8',
                function(err, ipData) {
                    const ip = ipData.replace(/(\n|\r)/ig, '')
                    const host = (!err && ip !== 'localhost') ? (ipData + ':10000') : 'localhost';
                    const paramData = param;

                    paramData.superPower = {
                        host : host,   
                        server:server
                    };
                    me.serverStatus((sts)=> {
                        let postData, cmd, cmdUpload;
                        let recommend = (!sts.resources || !sts.resources.recommend) ? [] : sts.resources.recommend;

                        if (sts.localIp === 'local' || !recommend.length) {
                            postData = "'" + JSON.stringify({
                                cmd:'setupServer',
                                data : paramData,
                                authToken: sts.authToken
                            }) + "'";
                            const regex = /([^/]+)\/([^/]+)\.git$/;
                            const uri_a = paramData.gitHub.match(regex);
                            const repo = ((!uri_a) ? false : (uri_a[1] + '_' + uri_a[2]));

                            const uploadFolder = env.dataFolder + '/sites/' + server + '/data/fileUpload/D_' + paramData.uploadId;
   
                            cmdFile = 'curl $(find ' + uploadFolder + ' -type f -exec echo " " -F file=@"{}" \\;) ';
                            cmdFile += ' -F "cmd=fileUpload"  -F "uploadID=' + paramData.uploadId + '" ';
                            cmdFile += ' -F "movetoDir=' +  server + '/' + repo + '_' + paramData.requestId + '" ';
                            cmdFile += ' localhost/upload'

                            console.log(cmdFile);
                            // console.log(env.localConfig);
                            cmd = 'curl -d ' + postData +
                                '  -H "Content-Type: application/json" -X POST localhost/api/';
                        } else { 
                            let item = recommend[Math.floor(Math.random() * recommend.length)];
                            postData = "'" + JSON.stringify({
                                cmd:'setupServer',
                                data : paramData,
                                gridToken: item.authToken
                            }) + "'";
                            cmd = 'curl -d ' + postData +
                                '  -H "Content-Type: application/json" -X POST ' + item.server+ ':10000/_grid/';
                        }
                        exec(cmdFile, {maxBuffer: 224 * 2048}, (error, stdout, stderr) => {
                            exec(cmd, {maxBuffer: 224 * 2048}, (error, stdout, stderr) => {
                                var jdata = {};
                                try {
                                jdata = JSON.parse(stdout);
                                } catch (e) {}
                                callback();
                            })
                        });
                    });  
            });
            
        }

        me.auditOndemand = () => {
            const fn = env.dataFolder + '/_servers_cfg.json';
            me.readJson(fn, (jdata) => {
                var alist = [];
                for (let o in jdata) {
                    if ((jdata[o].docker) && jdata[o].docker.type === 'ondemand') {
                        var minLife = ((!jdata[o].docker || !jdata[o].docker.minLife) ? 300 : parseInt(jdata[o].docker.minLife)) * 1000;
                        if (new Date().getTime() - jdata[o].created > minLife) {
                            alist.push(jdata[o]);
                        }
                    }
                }
                
                if (alist.length) {
                    console.log(alist);
                    const siteCommCronFn = env.dataFolder + '/sites/' + alist[0].serverName + '/data/commCron/';
                    fs.stat(siteCommCronFn, function(err, stat) {
                        if (err && err.code === 'ENOENT') {
                            me.removeMe(alist[0].serverName, {}, () => {
                                console.log('removeFromConfig');
                            });
                       } else {
                            fs.writeFile(siteCommCronFn + '_autoremove.json', JSON.stringify({
                                    "code" : "removeMe"
                                }), (err)=>{
                            });
                        }
                    });
                    
                }
            });
        }

        me.getGridToken = (cbk) => {
            me.serverStatus((sts) => {

            })
        }
        
        me.uploadFolder = (folderObj)=> {
            
            fs.stat(me.siteCommCronMark, function(err, stat) {
                if (err && err.code === 'ENOENT') {
                    let dirn = folderObj.dir + '/' + folderObj.folder + '/';
                    me.readJson(dirn + 'input/_dockerSetting.json',  (setting) => {
                        let host = (setting.onDemandCallbackHost === 'localhost') ? 'localhost' : (setting.onDemandCallbackHost);
                        fs.writeFile(me.siteCommCronMark, folderObj.folder, () => {
                            me.serverStatus((sts) => {
                                const targetFolder = 'gridReturn_' + new Date().getTime();
                                const filterList = [];
                                const cp = new CP();
                                const _f = {};

                                _f['input'] = (cbk) => {
                                    let cmd = 'cd ' + dirn + 'input';
                                        fs.readdir(dirn + 'input', (err, list) => {
                                            cmd += ' && curl -F "objPath=' + folderObj.dir + '/' + targetFolder + '/input" ';
                                            cmd += ' -F "gridToken=' + sts.gridToken + '" ';
                                            for (let i = 0; i < list.length; i++) {
                                                if (filterList.indexOf(list[i]) === -1) {
                                                    cmd += ' -F file=@' + list[i];
                                                }
                                            }
                                            cmd += ' ' + host + '/upload';
                                            cbk(cmd)
                                        });
                                }
                                _f['output'] = (cbk) => {
                                    let cmd = 'cd ' + dirn + 'output';
                                    fs.readdir(dirn + 'output', (err, list) => {
                                        cmd += ' && curl -F "objPath=' + folderObj.dir + '/' + targetFolder + '/output" ';
                                        cmd += ' -F "gridToken=' + sts.gridToken + '" ';
                                        for (let i = 0; i < list.length; i++) {
                                            if (filterList.indexOf(list[i]) === -1) {
                                                cmd += ' -F file=@' + list[i];
                                            }
                                        }
                                        cmd += ' ' + host + '/upload';
                                        cbk(cmd)
                                    });
                                }
                                cp.serial(_f, (resultData)=> {
                                    let cmd = cp.data.input + ' && ' + cp.data.output +  ' && rm -fr ' + dirn + "\n";
                                    exec(cmd, {maxBuffer: 224 * 2048},
                                        function(error, stdout, stderr) {
                                            var jdata = {};
                                            try {
                                            jdata = JSON.parse(stdout);
                                            } catch (e) {}
                                        
                                            me.removeMark(() => {
                                                console.log('mark removed!');
                                            }); 
                                    });
                                    
                                },30000);
                            });
                        });
                    })
                } else {
                    // console.log('skipped .me.');
                }
            });

        }
        me.readJson = (path, cb) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) {
                    cb({})
                } else {
                    var jdata = {};
                    try {
                        jdata = JSON.parse(data);
                    } catch (e) {}
                    cb(jdata);
                }
            })
        }
    }
    module.exports = obj;
})()
