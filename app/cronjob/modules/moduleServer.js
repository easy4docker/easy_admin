const { eventNames } = require('process');

(function() {
    var obj = function(env) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js');

        me.siteCommCronMark = env.dataFolder + '/siteCommCronMark.txt';
        me.siteCommCronFn = '';

        me.onDemand = (server, file, cbk) => {
            fs.stat(me.siteCommCronMark, function(err, stat) {
                if (err && err.code === 'ENOENT') {
                    me.siteCommCronFn = env.dataFolder + '/sites/' + server + '/data/commCron/' + file;
                    fs.writeFile(me.siteCommCronMark, me.siteCommCronFn, () => {
                        me.readJson(me.siteCommCronFn, (data) => {
                            if (typeof me[data.code] === 'function') {
                                console.log(data.code);
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
                        fs.unlink(me.siteCommCronMark, () => {
                            console.log('removed ... ' +  file);
                        });
                        
                    } else {
                        console.log('continuing ... ' +  file);
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

            _f['gridServers'] = (cbk)=> {
                var fn = env.keyFolder + '/_gridServers.json';
                me.readJson(fn, (data) => {
                    cbk(data)
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
                    gridServers : cp.data.gridServers,
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
            // const serverCode = server.replace(/\_([0-9]+)$/, '');
            var cmd = env.dataFolder  + '/_ip';
            fs.readFile(env.dataFolder  + '/_ip', 'utf-8',
                function(err, ipData) {
                    const host = (!err && ipData !== 'localhost') ? ipData : 'localhost:10000';
                    const paramData = param;
                    
                    paramData.superPower = {
                        host : host,   
                        server:server
                    };
                    me.serverStatus((sts)=> {
                        const postData = "'" + JSON.stringify({
                            cmd:'setupServer',
                            data : paramData,
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
            });
        }

        me.addOndemandBK = (server, param, callback) => {
            const paramData = param;
            paramData.superPower = {
                host : 'localhost',   
                server:server
            };
            me.serverStatus((sts)=> {
                const postData = "'" + JSON.stringify({
                    cmd:'setupServer',
                    data : paramData,
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
                console.log(alist);
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
