(function() {
    var exec = require('child_process').exec;
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        
        this.gitSwitchBranch = (serverName, branch, callback) => {
            var dirn = '/var/_localData/sites/' + serverName;
            var cmd = 'cd ' + dirn + ' && git checkout ' + branch;
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    callback({status : 'success'});                       
            });
        }

        this.gitRemoteBranchs = (gitRecord, callback) => {

            var _f = {};
            _f['branches'] = function(cbk) {
                var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
                var uri_a = gitRecord.gitHub.match(regex);
                var uri = uri_a[1] + '://' + ((!gitRecord.userName) ? '' : 
                    (encodeURIComponent(gitRecord.userName) + ':' + encodeURIComponent(gitRecord.password) + '@'));
                for (var i=4; i < uri_a.length; i++) {
                    uri +=  uri_a[i];
                }
                
                var cmd = 'git ls-remote ' + uri;
                exec(cmd, {maxBuffer: 1024 * 2048},
                    function(error, stdout, stderr) {
                        var branches = [];
                        var list = stdout.split(/\s+/);
                        if (!error) {
                            for (var i in list) {
                                let regs = /^refs\/heads\//i;
                                if (regs.test(list[i])) {
                                    branches.push(list[i].replace(regs, ''));
                                }
                            }
                            cbk({status : 'success', branches : branches });
                        } else {
                            cbk({status : 'failure', message : error.message});
                        }
    
                        
                });
            }
            _f['dockerFile'] = function(cbk) {
                var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
                var uri_a = gitRecord.gitHub.match(regex);
                var uri = uri_a[1] + '://' + ((!gitRecord.userName) ? '' : 
                    (encodeURIComponent(gitRecord.userName) + ':' + encodeURIComponent(gitRecord.password) + '@'));
                for (var i=4; i < uri_a.length; i++) {
                    uri +=  uri_a[i];
                }
                
                var CP1 = new pkg.crowdProcess(),
                    _f1 = {},
                    branches = (CP.data.branches.status === 'success') ? CP.data.branches.branches : [],
                    list = [];

                
                for (var i = 0; i < branches.length; i++) {
                    _f1['p_' + i] = (function(i) {
                        return function(cbk1) {
                            var cmd = 'svn cat ' + uri + '/branches/' + branches[i] + '/dockerSetting/config.json';
                            exec(cmd, {maxBuffer: 1024 * 2048},
                                function(error, stdout, stderr) {
                                    var setting = [];
                                    try {
                                        setting = JSON.parse(stdout.replace(/\s+/, ''));
                                    } catch (e) {}
                                    list.push({branch : branches[i], dockerSetting : setting});
                                    cbk1(true);
                            });
                        }
                    })(i)
                }
                CP1.serial(_f1, (dataCP1) => {
                    cbk(list);
                }, 30000);
            }
            CP.serial(_f, (dataCP) => {
                callback({status : 'success', list : CP.data.dockerFile});
            }, 30000);

        }

        this.gitClone = (dirn, gitRecord, callback) => {            
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            var uri_a = gitRecord.gitHub.match(regex);
            var uri = uri_a[1] + '://' + ((!gitRecord.serverrName) ? '' : 
                (encodeURIComponent(gitRecord.userName) + ':' + encodeURIComponent(gitRecord.password) + '@'));
            for (var i=4; i < uri_a.length; i++) {
                uri +=  uri_a[i];
            }
            var branchName = gitRecord.branch;

            var cmd = 'mkdir -p ' + dirn + ' && cd ' + dirn + ' && rm -fr ' + gitRecord.serverName + ' && git clone ' + 
                    uri + ' ' + gitRecord.serverName +  ' && ' + 
                    'cd ' + gitRecord.serverName  + ' && git checkout ' + branchName;

            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    if (!error) {
                        callback({status : 'success'});
                    } else {
                        callback({status : 'failure', message : error.message});
                    }
            });
        }

        this.gitCloneToFolder = (dirn, gitRecord, callback) => {            
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            var uri_a = gitRecord.gitHub.match(regex);
            var uri = uri_a[1] + '://' + ((!gitRecord.serverrName) ? '' : 
                (encodeURIComponent(gitRecord.userName) + ':' + encodeURIComponent(gitRecord.password) + '@'));
            for (var i=4; i < uri_a.length; i++) {
                uri +=  uri_a[i];
            }
            var branchName = gitRecord.branch;

            var cmd = 'rm -fr ' + dirn + ' && mkdir -p ' + dirn + ' && cd ' + dirn + 
                ' && git clone ' +  uri + ' . && ' + 
                    'cd ' + dirn + ' && git checkout ' + branchName;

            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    if (!error) {
                        callback({status : 'success'});
                    } else {
                        callback({status : 'failure', message : error.message});
                    }
            });
        }
    }

    module.exports = obj;
})()