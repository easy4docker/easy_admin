(function() {
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        var sitesCfgFn = '/var/_localAppData/_servers_cfg.json';
        var data_dir = '/var/_localAppData';

        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}

        // ==== 
        this.sitesPath = () => {
            return data_dir + '/sites';
        }

        this.sitePath = (serverName) => {
            return this.sitesPath() + '/' + serverName;
        }
        this.siteCodePath = (serverName) => {
            return this.sitePath(serverName) + '/code';
        }

        this.siteDataPath = (serverName) => {
            return this.sitePath(serverName) + '/data';
        }

        this.siteEnvPath = (serverName) => {
            return this.sitePath(serverName) + '/env';
        }

        this.siteContainer = (serverName) => {
            return ('sites-' + serverName + '-container').toLowerCase();
        }

        this.getImageName = (serverName) => {
            return ('sites-' + serverName + '-image').toLowerCase();
        }

        this.dockerPath = (serverName) => {
            return _env.data_folder + '/sites/' + serverName;
        }
        this.dockerCodePath = (serverName) => {
            return this.dockerPath(serverName) + '/code';
        }
        this.dockerDataPath = (serverName) => {
            return this.dockerPath(serverName) + '/data';
        }
        this.dockerEnvPath = (serverName) => {
            return this.dockerPath(serverName) + '/env';
        }

        this.pullCode = (serverName, callback) => {
            var cmd = 'cd ' + this.siteCodePath(serverName) + ' && git pull';
            exec(cmd, {maxBuffer: 224 * 2048},
                function(error, stdout, stderr) {
                    callback({status:'success'});
            });
        }; 

        this.stopVServer = (serverName, callback) => {
            me.templateContent(serverName, 'removeDockerApp.tpl', (content) => {
                me.setCron('stopVServer-' + serverName, content, callback);
            });
        };

        this.startVServer = (serverName, callback) => {
            me.templateContent(serverName, 'addDockerApp.tpl', (content) => {
                me.setCron('startDockerServer-' + serverName, content, callback);
            });
        };

        this.createStartUpVServers = (callback) => {
            callback({status:'success', message: 'createStartUpVServers'});
            /*
            var v = me.getSitesCfg();
            var str = '';
            for (var o in v) {
                str += "## --- Start " + o + " ---\n";
                str += me.templateCMD('addDockerApp.tpl', o);
            }
            fs.writeFile(data_dir + '/_startUpScript.sh', str, function (err) {
                setTimeout(() => {
                    callback({status:'success', message: 'createStartUpVServers'});
                }, 500)
            });*/
        };

        this.removeAllServers = (callback) => {
            setTimeout(
                () => {
                    callback({status:'success'});
                }, 6000
            );
        };

        this.setCron = (code, str, callback) => {
            fs.writeFile(data_dir + '/commCron/' + code + '_' + new Date().getTime() + '.sh', str, function (err) {
                setTimeout(() => {
                    callback({status:'success', message: code});
                }, 500)
            });
        }

        this.saveEtcHosts = (callback) => {
            var str='';
            str += "#!/bin/bash\n";
            str += 'MARKS="#--UI_EASYDOCKER_S--"' + "\n" + 'MARKE="#--UI_EASYDOCKER_E--"' + "\n";
            str += 'NLINE=$' + "'" + '\\n' + "'\n" + 'TABL=$' + "'" + '\\t' + "'\n";
            str += 'v=$(sed "/"$MARKS"/,/"$MARKE"/d" /etc/hosts)' + "\n";
            
            var sites_list = me.getSitesCfg();
            str += 'p="';
            str += (!sites_list || !Object.keys(sites_list).length) ? '' : '${MARKS}${NLINE}';

            str += '127.0.0.1${TABL}admin.local${NLINE}';
            str += '127.0.0.1${TABL}admin_local${NLINE}';

            for (var o in sites_list) { 
                str += '127.0.0.1${TABL}' + o + '.local${NLINE}';
                str += '127.0.0.1${TABL}' + o + '_local${NLINE}';
            }
            str += (!sites_list || !Object.keys(sites_list).length) ? '"' : '${MARKE}"' + "\n";
            str += 'echo "${v}\n${p}" > /etc/hosts' + "\n";
            me.setCron('saveEtcHosts', str, callback);
        }
        
        this.postLoadListBB = (callback) => { // use this
            var sites_list = me.getSitesCfg();
            var list = [];
            for (o in sites_list ) {
                let v = sites_list[o];
                v.name = o;
                list.push(v);
            }
            callback({status:'success', list : list });
        }
        this.postLoadList = (callback) => { // use this
            me.getSites((sites_list) => {
                var list = [];
                for (o in sites_list ) {
                    let v = sites_list[o];
                    v.name = o;
                    list.push(v);
                }
                callback({status:'success', list : list });
            });
        }
/*
        this.askToken= (serverName, callback) => { // use this
            let fn_env = me.siteEnvPath(serverName) + '/key.json';
            let fn_token = me.siteEnvPath(serverName) + '/token.json';
            let env = {}, tokens = '';
            try {
                env = pkg.require(fn_env);
            } catch(e) {}
            try {
                tokens = pkg.require(fn_token);
            } catch(e) {}
            callback({status:'success', tokens : tokens });
        }

        this.addAToken= (serverName, callback) => { 
            let fn_token = me.siteEnvPath(serverName) + '/token.json';
            let tokens = {list : {}};
            try {
                tokens = pkg.require(fn_token);
            } catch(e) {};
            if (!tokens.list) tokens.list = {};
            tokens.list[me.makeid(64)] = new Date();
            fs.writeFile(fn_token, JSON.stringify(tokens), 
            (err) => {
                callback({status:'success', list : tokens.list});
            });
            
        }

        this.deleteToken= (serverName, token, callback) => { 
            let fn_token = me.siteEnvPath(serverName) + '/token.json';
            let tokens = {list : {}};
            try {
                tokens = pkg.require(fn_token);
            } catch(e) {};
            if (!tokens.list) tokens.list = {};
            delete tokens.list[token];
            fs.writeFile(fn_token, JSON.stringify(tokens), 
            (err) => {
                callback({status:'success', list : tokens.list});
            });
            
        }

        this.getAllTokens= (serverName, callback) => { 
            let fn_token = me.siteEnvPath(serverName) + '/token.json';
            let tokens = {};
            try {
                tokens = pkg.require(fn_token);
            } catch(e) {}
            callback({status:'success', list : (!tokens.list) ? {} : tokens.list});
        }
*/
        me.adjustData = (data, callback) => {
            me.getSites(
                (list) => {
                    let nidx = me.generateServerName(data.serverName, list);
                    data.serverName = nidx;
                    callback(data);
            });
        }

        this.saveSitesServers = (data, callback) => {
            me.getSites(
                (list) => {
                    let nidx = me.generateServerName(data.serverName, list);
                    data = {
                        serverName  : nidx,
                        gitHub      : data['gitHub'],
                        hashCode    : data['hashCode'],
                        docker      : (!data.dockerSetting) ? [] : data.dockerSetting,
                        branch      : data['branch'],
                        unidx       : me.getNewUnIdx(list)
                    }
                    list[nidx] = data;
                    me.saveSites(list, (list) => {
                        callback({status:'success', list : list});
                    });
            });
        }
        me.generateServerName = (baseName, list) => {
            let i = 0;
            do {
                const n = baseName + ((!i)?'':('_' + i));
                if (!list[n]) {
                    return n;
                }
                i++;
            }
            while (true);
        }
        me.getSites = (callback) => {
            pkg.readJson(sitesCfgFn, (list) => {
                callback(list);
            });
        }
        me.saveSites = (list, callback) => {
            fs.writeFile(sitesCfgFn, JSON.stringify(list),(err) => {
                callback(list);
            });
        }
        this.gitSiteBranchs = (serverName, callback) => {
            var _f = {};
            _f['getBranches'] = function(cbk) {
                var cmd = 'cd ' + me.siteCodePath(serverName) + ' && git branch -r';
                exec(cmd, {maxBuffer: 224 * 2048},
                    function(error, stdout, stderr) {
                        var branches = [];
                        var list = stdout.split(/\s+/);
                        if (!error) {
                            for (var i in list) {
                                let regs = /^origin\/([a-z0-9\-\_]+)$/i;
                                if (regs.test(list[i])) {
                                    var item = list[i].replace(/^origin\//i, '');
                                    if (item !== 'HEAD' && branches.indexOf(item) === -1) {
                                        branches.push(item);
                                    }
                                }
                            }
                            cbk({status : 'success', branches : branches });
                        } else {
                            cbk({status : 'failure', message : error.message});
                        }
    
                        
                });
            }
            CP.serial(_f, (dataCP) => {
                callback({status : 'success', list : CP.data.getBranches});
            }, 30000);

        }
        // --- TODO---
        
        this.gitSwitchBranch = (serverName, branch, callback) => {
            // var dirn = '/var/_localAppData/sites/' + serverName;
            var cmd = 'cd ' + me.siteCodePath(serverName) + ' && git checkout ' + branch;
            exec(cmd, {maxBuffer: 224 * 2048},
                function(error, stdout, stderr) {
                    // callback({status : 'successB', cfg : me.getSitesCfg()});
                    me.updateConfigBranch(serverName, branch, 
                        ()=> {
                            callback({status : 'successB'})
                        });
            });
        }
        
        this.updateConfigBranch = (serverName, branch, callback) => {
            let sitesCfg = me.getSitesCfg();
            if (sitesCfg[serverName]) {
                sitesCfg[serverName].branch = branch;
            }
            me.saveSitesCfg(sitesCfg, callback, true);
        }
        this.getSitesCfg = () => {
            var v = {}, p;
            try {
                var p = pkg.require(sitesCfgFn);
                if (typeof p == 'object') {
                    v = p;
                }
            } catch (e) {}
            return v;
        }

        this.saveSitesCfg = (v, callback, noEtcUpdate) => {
            fs.writeFile(sitesCfgFn, JSON.stringify(v), 
                (err) => {
                    if (!noEtcUpdate) {
                        me.saveEtcHosts(
                            () => {
                                callback(err);
                            }
                        )
                    } else {
                        callback(err);
                    }
            });
        }    
        me.getNewUnIdx = (sites_list) => {
            var unidx_max = 0;
            for (var o in sites_list) { 
                unidx_max = (sites_list[o].unidx > unidx_max) ? sites_list[o].unidx : unidx_max;
            }
            for (var i = 0; i < unidx_max; i++) {
                var mark = 0;
                for (var o in sites_list) { 
                    if (sites_list[o].unidx === (i + 1)) {
                        mark = 1;
                        break;
                    }
                }
                if (!mark) {
                    return i + 1;
                }
            }
            return unidx_max + 1;
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
         me.saveData = (pathName, fileName, data, callback) => {
            let cmd = 'mkdir -p ' + pathName;
            exec(cmd, {maxBuffer: 224 * 2048},
                function(error, stdout, stderr) {
                fs.writeFile(pathName + '/' + fileName, data, function (err) {
                    callback((!err) ? {status : 'success'} : {status : 'failure', message : err.message });
                });  
            });
        }

        me.saveKeyCode = (serverName, randomCode, callback) => {
            me.saveData(me.siteEnvPath(serverName), 'key.json', JSON.stringify({key : randomCode }), callback);
        }

        me.saveInitToken = (serverName, initToken, callback) => {
            me.saveData(me.siteEnvPath(serverName), 'token.json', JSON.stringify({initToken : initToken}), callback);
        }

        me.saveVserverValiables = (data, callback) => {
            me.saveData(me.siteEnvPath(data.serverName), 'variables.json', data.contents, callback);
        }

        me.asycReadCode = (list, callback) => {
            
        };

        this.getInitToken = (serverName) => {
            let fn = me.siteEnvPath(serverName) + '/token.json';
            var v = {};
            try {
                v = pkg.require(fn);
            } catch (e) {}
            return (v.initToken) ? v.initToken : me.makeid(64); 
        }

        this.getKeyCode = (serverName) => {
            let fn = me.siteEnvPath(serverName) + '/key.json';
            var v = {};
            try {
                v = pkg.require(fn);
            } catch (e) {}
            return (v.key) ? v.key : me.makeid(32); 
        }

        this.getVserverValiables = (data, callback) => {
            var fn = me.siteEnvPath(data.serverName) + '/variables.json';
            fs.readFile(fn, 'utf-8', (err, data)=> {
                callback((!err) ? {status : 'success', data : data} : {status : 'failure', message : err.message });
            });    
        }

        this.addVServer = (data, callback) => {
            var _f={};
            var randomCode = me.getKeyCode(data.serverName);
            var initToken = me.getInitToken(data.serverName);    
            
            _f['serverName'] = function(cbk) {
                data.serverName = data.repo;
                me.adjustData(data, (adjustedData) => {
                    data = adjustedData;
                    cbk(data.serverName)
                });
            };
            _f['cloneCode'] = function(cbk) {
                var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
                var git = new MGit(env, pkg);
      
                git.gitCloneToFolder(me.siteCodePath(data.serverName), data, (result) => {
                    cbk(result);
                });
            };
       
            _f['saveKeyCode'] = function(cbk) {
                me.saveKeyCode(data.serverName,  randomCode, cbk);
            };

            _f['saveinitToken'] = function(cbk) {
                me.saveInitToken(data.serverName,  initToken, cbk);
            };
            

            _f['SitesServers'] = function(cbk) {
                me.saveSitesServers(data, cbk);
            };
            
            _f['addDocker'] = function(cbk) {
                me.addDocker(data.serverName, cbk, randomCode);
            };
            
            _f['addSiteCronFolder'] = function(cbk) {
                let cmd = 'mkdir -p ' + me.siteDataPath(data.serverName) + '/commCron/';
                exec(cmd, {maxBuffer: 224 * 2048},
                    function(error, stdout, stderr) {
                        cbk(true);
                });
            };
        
            _f['addRemoveMe'] = function(cbk) {
                me.addRemoveMe(data.serverName, cbk);
            };
            
            _f['createStartUpVServers'] = function(cbk) {
                me.createStartUpVServers(cbk); 
            };

            CP.serial(_f, function(result) {
                callback(CP.data.SitesServers);
               // callback(result);
            }, 30000);
        }

        this.deleteVServer = (serverName, callback) => {
            const   _f = {};

            _f['removeDocker'] = function(cbk) {
                me.removeDocker(serverName, cbk);
            };

            _f['deleteCfg'] = function(cbk) {
                var sites_list = me.getSitesCfg();
                delete sites_list[serverName];
                me.saveSitesCfg(sites_list, () => {
                    cbk(true);
                });
            };

            _f['deleteCode'] = function(cbk) {
                cmd = 'rm -fr ' + me.sitePath(serverName);;
                exec(cmd, {maxBuffer: 224 * 2048},
                    function(error, stdout, stderr) {
                        cbk(true);
                });
            };
        
            _f['createStartUpVServers'] = function(cbk) {
                me.createStartUpVServers(cbk); 
            };

            CP.serial(_f, function(data) {
                callback(data);
                // me.postLoadList(callback);
            }, 30000);
        };

        me.dockerConfig = (serverName, callback) => {
            me.getSites(
                (list) => {
                var site_config = list[serverName];
                var cmdPorts  = '',
                cmdCloudPort  = '';
                mainPort = [];

                let ports = (!site_config || !site_config.docker || !site_config.docker.ports) ? [] : site_config.docker.ports;
                for (var i = 0;  i < ports.length; i++) {
                    var mPort =  (10000 + parseInt(site_config.unidx * 1000) + parseInt(ports[i]));
                    mainPort.push(mPort);
                    cmdPorts += ' -p ' + mPort + ':' + ports[i] + ' ';
                }
                let cloudPort = (!site_config || !site_config.docker || !site_config.docker.cloudPort) ? [] : site_config.docker.cloudPort;
                for (var i = 0;  i < cloudPort.length; i++) {
                    cmdCloudPort += ' -p ' + (30000 + parseInt(site_config.unidx * 1000) + parseInt(cloudPort[i])) + ':' + cloudPort[i] + ' ';
                }
                callback({
                    serverName          : serverName,
                    dockerCodePath      : me.dockerCodePath(serverName),
                    dockerSettingPath   : me.dockerCodePath(serverName) + '/dockerSetting',
                    dockerDataPath      : me.dockerDataPath(serverName),
                    dockerEnvPath       : me.dockerEnvPath(serverName),
                    dockerFile          : me.dockerCodePath(serverName) + '/dockerSetting/dockerFile',
                    siteImage           : me.getImageName(serverName),
                    siteContainer       : me.siteContainer(serverName),
                    mainIP              : _env.main_ip,
                    mainPort            : mainPort.join(','),
                    cmdPorts            : cmdPorts,
                    engPorts            : cmdCloudPort,
                    sitePath            : me.sitePath(serverName),
                    siteCodePath        : me.siteCodePath(serverName),
                    keyCode             : me.getKeyCode(serverName),
                    initToken           : me.getInitToken(serverName)
                });
            });
        };

        me.templateContent = (serverName, tplName, callback) => {
            me.dockerConfig(serverName, (configJson) => {
                let cmd = '';
                try {
                    const tpl = pkg.ECT({ watch: true, cache: false, root: me.siteCodePath(serverName) + '/dockerSetting/scriptTemplate/', ext : '.tpl' });
                    cmd = tpl.render(tplName, configJson);
                } catch(e) {
                    cmd = 'echo "' + e.message + '"' + "\n";
                }
                callback(cmd);
            })
        }

        me.addDocker = (serverName, callback) => {
            me.templateContent(serverName, 'addDockerApp.tpl', (content) => {
                me.setCron('addDocker-' + serverName, content, callback);
            });
        }

        me.removeDocker = (serverName, callback) => {
            me.templateContent(serverName, 'removeDockerApp.tpl', (content) => {
                me.setCron('removeDocker-' + serverName, content, callback);
            });
        }

        me.addRemoveMe = (serverName, callback) => {
            me.templateContent(serverName, 'removeDockerApp.tpl', (content) => {
                const fn = me.siteDataPath(serverName) + '/REMOVE.ME';
                fs.writeFile(fn, content, function (err) {
                    callback({status:'success'});
                });
            });
        }
    }
    module.exports = obj;
})()