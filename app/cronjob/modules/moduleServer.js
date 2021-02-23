(function() {
    var obj = function(env) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js');

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
   
        me.removeMe = (server, param, callback) => {
            const _f = {};
            _f['removeCfg'] = (cbk) => {
                me.deleteServer(server, (data) => {
                    console.log('==deleteServer==>>' + server);
                    console.log(data);
                    cbk(true);
                });
            }
            _f['deleteFolder'] = (cbk)=> {
                var cmd = 'rm -fr ' + env.dataFolder + '/sites/' + server;
                console.log(cmd);
                cbk(cmd);
                /*   
                    exec(cmd, {maxBuffer: 224 * 2048},
                        function(error, stdout, stderr) {
                            cbk(true);
                    });
                */ 
            }

            const cp = new CP();
            cp.serial(_f, (data) => {
                console.log(data);
                callback(true);
            }, 3000);  
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
                    console.log(jdata)
                    cb(jdata);
                }
            })
        }
    }
    module.exports = obj;
})()
