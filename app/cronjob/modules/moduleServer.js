const { eventNames } = require('process');

(function() {
    var obj = function(env) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js'),
            ECT = require('ect');

        me.siteCommCronMark = '';
        me.siteCommCronFn = '';

        me.onDemand = (server, file, cbk) => {
            fs.stat(me.siteCommCronMark, function(err, stat) {
                if(err.code === 'ENOENT') {
                    me.siteCommCronFn = env.dataFolder + '/sites/' + server + '/data/commCron/' + file;
                    me.readJson(me.siteCommCronFn, (data) => {
                        console.log(data);
                    });
                } else {
                    console.log('current me.siteCommCronMark -> ' +  me.siteCommCronFn );
                }
            });
            /*
            var fn = env.dataFolder + '/sites/' + server + '/data/commCron/' + file;
            me.readJson(fn, (data) => {
                exec('rm -fr ' + fn, {maxBuffer: 224 * 2048},
                    function(error, stdout, stderr) {
                        if (typeof me[data.code]) {
                            me[data.code](server, data.param, cbk);
                        } else {
                            console.log('Missing method ' + data.code + '!');
                        }
                });
            });*/
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
                        console.log(jdata);
                });
            });
        }

        me.addOndemand = (github, param, callback) => {
            me.serverStatus((sts)=> {
                const postData = "'" + JSON.stringify({
                    cmd:'setupServer',
                    data : param,
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
                        console.log(jdata);
                });
            });  
        }
        /*
        me.removeOndemand = (github, param, callback) => {
            me.serverStatus((sts)=> {
                var cmd = 'curl -d ' + postData +
                    '  -H "Content-Type: application/json" -X POST localhost/api/';
                exec(cmd, {maxBuffer: 224 * 2048},
                    function(error, stdout, stderr) {
                        var jdata = {};
                        try {
                        jdata = JSON.parse(stdout);
                        } catch (e) {}
                        console.log(jdata);
                });
            });  
        }
        */
        
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
