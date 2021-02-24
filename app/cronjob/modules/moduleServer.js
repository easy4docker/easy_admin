const { eventNames } = require('process');

(function() {
    var obj = function(env) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js'),
            ECT = require('ect');

        me.onDemand = (server, file, cbk) => {
            var fn = env.dataFolder + '/sites/' + server + '/data/commCron/' + file;
            me.readJson(fn, (data) => {
                if (typeof me[data.code]) {
                    me[data.code](server, data.param, cbk);
                } else {
                    console.log('Missing method ' + data.code + '!');
                }
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
                    cmd:'huyouGrid',
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
            /* */
            const _f = {};
            _f['cleanDockerContainer'] = (cbk)=> {
                me.templateContent(server, 'removeDockerApp.tpl', (content) => {
                    me.setCron('removeOnDemainDocker-' + server, content, cbk);
                });
            }
            _f['removeCfg'] = (cbk) => {
                me.deleteServer(server, (data) => {
                    me.saveSites(data, () => {
                        cbk(true);
                    });
                });
            }
            _f['deleteFolder'] = (cbk)=> {
                var cmd = 'rm -fr ' + env.dataFolder + '/sites/' + server;
                exec(cmd, {maxBuffer: 224 * 2048},
                    function(error, stdout, stderr) {
                        cbk(true);
                });
            }

            const cp = new CP();
            cp.serial(_f, (data) => {
                console.log(data);
                callback(true);
            }, 3000);  
        }
        /*------*/

        me.siteContainer = (serverName) => {
            return ('sites-' + serverName + '-container').toLowerCase();
        }

        me.getImageName = (serverName) => {
            return ('sites-' + serverName + '-image').toLowerCase();
        }
        /*----*/

        me.dockerConfig = (server, callback) => {
            callback({
                serverName          : server,
                siteImage           : me.getImageName(server),
                siteContainer       : me.siteContainer(server)
            });
        };

        me.templateContent = (server, tplName, callback) => {
            me.dockerConfig(server, (configJson) => {
                let cmd = '';
                try {
                    const tpl = ECT({ watch: true, cache: false, root: env.dataFolder + '/sites/' + server + '/code/dockerSetting/scriptTemplate/', ext : '.tpl' });
                    cmd = tpl.render(tplName, configJson);
                } catch(e) {
                    cmd = 'echo "' + e.message + '"' + "\n";
                }
                
                callback(cmd);
            })
        }

        me.getSites = (cbk) => {
            me.readJson(env.dataFolder + '/_servers_cfg.json', (list) => {
                cbk(list);
            });
        }

        me.deleteServer = (server, cbk) => {
            me.getSites((sites) => {
                delete sites[server];
                cbk(sites);
            });
        }

        me.saveSites = (list, callback) => {
            fs.writeFile(env.dataFolder + '/_servers_cfg.json', JSON.stringify(list), (err) => {
                callback(list);
            });
        }
        me.setCron = (code, str, callback) => {
            fs.writeFile(env.dataFolder + '/commCron/' + code + '_' + new Date().getTime() + '.sh', str, function (err) {
                setTimeout(() => {
                    callback({status:'success', message: code});
                }, 500)
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
