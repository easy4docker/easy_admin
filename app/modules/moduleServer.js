(function() {
    var obj = function(serverType, env, pkg) {
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
            return data_dir + '/' + serverType;
        }

        this.sitePath = (serverName) => {
            return this.sitesPath() + '/' + serverName;
        }
        this.siteCodePath = (serverName) => {
            return this.sitePath(serverName) + '/code';
        }

        this.siteEnvPath = (serverName) => {
            return this.sitePath(serverName) + '/env';
        }

        this.siteDockerTemplatePath = (serverName) => {
            return me.siteCodePath(serverName) + '/dockerSetting/scriptTemplate';
        }

        this.siteContainer = (serverName) => {
            return (serverType + '-' + serverName + '-container').toLowerCase();
        }

        this.getImageName = (serverName) => {
            return (serverType + '-' + serverName + '-image').toLowerCase();
        }

        this.dockerPath = (serverName) => {
            return _env.data_folder + '/' + serverType + '/' + serverName;
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

        // ===========
        
        this.pullCode = (serverName, callback) => {
            var cmd = 'cd ' + this.siteCodePath(serverName) + ' && git pull';
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    callback({status:'success'});
            });
        }; 

        this.viewLogs = (serverName, callback) => {
            var _f = {};
            _f['sendClone'] = function(cbk) {
                me.setCron('afterAddDocker-' + serverName, me.templateCMD('afterAddDockerApp.tpl', serverName), cbk);
            }
            CP.serial(_f, function(data) {
                callback({status:'successC'});
            }, 30000);
        }; 

        this.stopVServer = (serverName, callback) => {
            me.setCron('stopVServer-' + serverName, me.templateCMD('removeDockerApp.tpl', serverName), callback);
        };

        this.startVServer = (serverName, callback) => {
            me.setCron('startDockerServer-' + serverName, me.templateCMD('addDockerApp.tpl', serverName), callback);
        };

        this.createStartUpVServers = (callback) => {
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
            });
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
        
        this.postLoadList = (callback) => { // use this
            var sites_list = me.getSitesCfg();
            var list = [];
            for (o in sites_list ) {
                let v = sites_list[o];
                v.name = o;
                list.push(v);
            }
            callback({status:'success', list : list });
        }

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

        this.saveSitesServers = (data, callback) => {
            
            var v = me.getSitesCfg();
            v[data['serverName']] = {
                gitHub      : data['gitHub'],
                serverType  : data['serverType'],
                branch      : data['branch'],
                publicDocker: data['publicDocker'],
                unidx       : me.getNewUnIdx(),
                docker      : data['docker']
            };
            me.saveSitesCfg(v, () => {
                callback({status:'success', list : me.getSitesCfg()});
            });
        }

        this.gitSiteBranchs = (serverName, callback) => {
            var _f = {};
            _f['getBranches'] = function(cbk) {
                var cmd = 'cd ' + me.siteCodePath(serverName) + ' && git branch -r';
                exec(cmd, {maxBuffer: 1024 * 2048},
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
            exec(cmd, {maxBuffer: 1024 * 2048},
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

        this.getSiteConfig = (serverName) => {
            var sites_list = me.getSitesCfg();
            var site_config = sites_list[serverName];
            return (!site_config.publicDocker) ? site_config : site_config.publicDocker;
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
        this.getNewUnIdx = () => {
            var unidx_max = 0,
                sites_list = me.getSitesCfg();
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

        this.makeid = (length) => {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }

        this.saveKeyCode = (serverName, randomCode, callback) => {
            let v = {
                key : randomCode
            };
            let fn = me.siteEnvPath(serverName) + '/key.json',
                cmd = 'mkdir -p ' + me.siteEnvPath(serverName);
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    fs.writeFile(fn, JSON.stringify(v), function (err) {
                        callback((!err) ? {status : 'success'} : {status : 'failure', message : err.message });
                    });  
            });

        }

        this.saveInitToken = (serverName, initToken, callback) => {
            let v = {
                initToken : initToken
            };
            let fn = me.siteEnvPath(serverName) + '/token.json',
                cmd = 'mkdir -p ' + me.siteEnvPath(serverName);
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    fs.writeFile(fn, JSON.stringify(v), function (err) {
                        callback((!err) ? {status : 'success'} : {status : 'failure', message : err.message });
                    });  
            });

        }

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

        this.saveVserverValiables = (data, callback) => {
            var fn = me.siteEnvPath(data.serverName) + '/variables.json';
            cmd = 'mkdir -p ' + me.siteEnvPath(data.serverName);
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                fs.writeFile(fn, data.contents, function (err) {
                    callback((!err) ? {status : 'success'} : {status : 'failure', message : err.message });
                });    
            });
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
            var serverName = data.serverName;
            _f['cloneCode'] = function(cbk) {
                var MGit = pkg.require(env.root+ '/modules/moduleGit.js');
                var git = new MGit(env, pkg);
                git.gitCloneToFolder(me.siteCodePath(serverName), data, function(result) {
                    cbk(true);
                });
            };
       
            _f['saveKeyCode'] = function(cbk) {
                me.saveKeyCode(serverName,  randomCode, cbk);
            };

            _f['saveinitToken'] = function(cbk) {
                me.saveInitToken(serverName,  initToken, cbk);
            };
            

            _f['SitesServers'] = function(cbk) {
                me.saveSitesServers(data, cbk);
            };
            
            _f['addDocker'] = function(cbk) {
                me.addDocker(data.serverName, cbk, randomCode);
            };
            
            _f['createStartUpVServers'] = function(cbk) {
                me.createStartUpVServers(cbk); 
            };

            CP.serial(_f, function(result) {
                callback(CP.data.SitesServers);
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
                exec(cmd, {maxBuffer: 1024 * 2048},
                    function(error, stdout, stderr) {
                        cbk(true);
                });
            };
        
            _f['createStartUpVServers'] = function(cbk) {
                me.createStartUpVServers(cbk); 
            };

            CP.serial(_f, function(data) {
                me.postLoadList(callback);
            }, 30000);
        };

        this.dockerConfig = (serverName) => {
            
            var site_config = me.getSiteConfig(serverName);
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
            return {
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
                initToken         : me.getInitToken(serverName)
            }
        }

        this.templateCMD = (tplName, serverName) => {
            let cmd = '';
            try {
                const tpl = pkg.ECT({ watch: true, cache: false, root: me.siteDockerTemplatePath(serverName) + '/', ext : '.tpl' });
                cmd = tpl.render(tplName, me.dockerConfig(serverName));
            } catch(e) {
                cmd = 'echo "' + e.message + '"' + "\n";
            }
            return cmd;
        }

        this.addDocker = (serverName, callback) => {
            me.setCron('addDocker-' + serverName, me.templateCMD('addDockerApp.tpl', serverName), callback);
        }

        this.removeDocker = (serverName, callback) => {
            me.setCron('removeDocker-' + serverName, me.templateCMD('removeDockerApp.tpl', serverName), callback);
        }
    }
    module.exports = obj;
})()
