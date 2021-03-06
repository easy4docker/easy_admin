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
   
                    me[onDemandData.code](onDemandObj[0], param, () => {
                        fs.unlink(env.dataFolder + '/sites/' + onDemandCode, cbk);
                    });
                } else {
                    console.log('wrong ondemand code =>' + onDemandData.code);
                }
                
            });
        }

        me.completedOnDemand = (callback) => {
            const cmd = 'find  '+ env.shareFolder + ' -type f -name ondemand_finished.data';
            exec(cmd, {maxBuffer: 224 * 2048}, (error, stdout, stderr) => {
                if (stdout) {
                    const item = stdout.split(/\s+/).filter((v)=>{ return (!!v)})[0];
                    const v = (!item) ? [] : item.replace(env.shareFolder + '/', '').split('/');
                    const cmd1 = 'rm  ' + item;
                    exec(cmd1, {maxBuffer: 224 * 2048}, (error1, stdout1, stderr1) => {
                        const folderObj = {
                            dir: env.shareFolder + '/' + v[0], folder : v[1]
                        };
                        me.removeMe((!v.length > 1) ? '' : v[v.length-2], ()=> {
                            me.uploadResult(folderObj, callback);
                        });
                    });
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
                me.readJson(fn, (JSONData) => {
                    let token = '';
                    for (var o in JSONData) {
                        if (/^SU\_/.test(o)) {
                            token = o;
                            break;
                        }
                    } 
                    token = (token) ? token : ('SU_' + me.makeid(32));
                    JSONData[token] = new Date().getTime();
                    fs.writeFile(fn, JSON.stringify(JSONData), () => {
                        cbk(token)
                    })
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

        me.makeid = (length) => {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        me.removeMe = (server, callback) => {
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
                       me.removeMark(() => {
                            callback();
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
                        let postData, cmd, cmdFile;
                        let recommend = (!sts.resources || !sts.resources.recommend) ? [] : sts.resources.recommend;

                        const regex = /([^/]+)\/([^/]+)\.git$/;
                        const uri_a = paramData.gitHub.match(regex);
                        const repo = ((!uri_a) ? false : (uri_a[1] + '_' + uri_a[2]));

                        // const uploadFolder = env.dataFolder + '/sites/' + server + '/data/fileUpload/D_' + paramData.uploadId;
                        const uploadFolder = env.dataFolder + '/sitesShareFolder/fileUpload/D_' + paramData.uploadId;

                        cmdFile = 'curl $(find ' + uploadFolder + ' -type f -exec echo " " -F file=@"{}" \\;) ';
                        cmdFile += ' -F "cmd=fileUpload"  -F "uploadID=' + paramData.uploadId + '" ';
                        cmdFile += ' -F "movetoDir=' +  server + '/' + repo + '_' + paramData.requestId + '" ';
                        

                        if (sts.localIp === 'local' || !recommend.length) {
                            postData = "'" + JSON.stringify({
                                cmd:'setupServer',
                                data : paramData,
                                authToken: sts.authToken
                            }) + "'";

                            cmdFile += ' localhost/upload'
                            cmd = 'curl -d ' + postData +
                                '  -H "Content-Type: application/json" -X POST localhost/api/';
                        } else { 
                            let item = recommend[Math.floor(Math.random() * recommend.length)];
                            postData = "'" + JSON.stringify({
                                cmd:'setupServer',
                                data : paramData,
                                gridToken: item.authToken
                            }) + "'";

                            cmdFile += ' ' + item.server + ':10000/upload'
                            cmd = 'curl -d ' + postData +
                                '  -H "Content-Type: application/json" -X POST ' + item.server+ ':10000/_grid/';
                        }
                        exec(cmdFile, {maxBuffer: 224 * 2048}, (error, stdout, stderr) => {
                            exec(cmd, {maxBuffer: 224 * 2048}, (error, stdout, stderr) => {
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
        me.cleanPenddingRec = (folderDir, targetFolder, callback) => {
            const a = targetFolder.match(/\_([0-9]+)$/);
            console.log('==AAA==>');
            console.log(folderDir);
            console.log('==AAAC==>');
            console.log(targetFolder);
            console.log('=BBBA==>');
            console.log(a);
            const requestId = a[1];
            if (requestId) {
                const cmd = 'rm -fr ' + folderDir.replace('/sitesShareFolder/', '/sites/') + '/data/_pendding/*' + requestId + '.json'
                console.log(cmd);
                exec(cmd, {maxBuffer: 224 * 2048},
                    function(error, stdout, stderr) {
                        callback();
                });
            } else {
                callback();
            }
        }
        me.uploadResult = (folderObj, callback)=> {
            fs.stat(me.siteCommCronMark, function(err, stat) {
                if (err && err.code === 'ENOENT') {
                    let dirn = folderObj.dir + '/' + folderObj.folder + '/';

                    me.readJson(dirn + 'input/_dockerSetting.json',  (setting) => {
                       let host = (setting.onDemandCallbackHost === 'localhost') ? 'localhost' : (setting.onDemandCallbackHost);
                       // let host = (setting.onDemandCallbackHost === 'localhost') ? 'localhost' : (setting.onDemandCallbackHost + ':10000');
                        fs.writeFile(me.siteCommCronMark, folderObj.folder, () => {
                            me.serverStatus((sts) => {
                                const targetFolder = 'result_' + folderObj.folder;
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
                                            me.cleanPenddingRec(folderObj.dir, targetFolder, callback);
                                    });
                                    
                                },30000);
                            });
                        });
                    })
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
