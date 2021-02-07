(function() {
    var obj = function(env, pkg) {
        const me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        me.gitSwitchBranch = (serverName, branch, callback) => {
            var dirn = '/var/_localAppData/sites/' + serverName;
            var cmd = 'cd ' + dirn + ' && git checkout ' + branch;
            exec(cmd, {maxBuffer: 224 * 2048},
                function(error, stdout, stderr) {
                    callback({status : 'success'});                       
            });
        }

        me.gitRemoteBranchs = (gitRecord, data_dir, callback) => {
            const regex = /([^/]+)\/([^/]+)\.git$/;
            const uri_a = gitRecord.gitHub.match(regex);
            const repo = ((!uri_a) ? false : (uri_a[1] + '_' + uri_a[2]));
            let tmp_dir = data_dir + '/tmp/repo/' + repo;
            const _f = {};
            
            _f['hashCode'] = (cbk) => {
                if (!repo) CP.exit = true;
                cbk(pkg.md5(gitRecord.gitHub));
            }           
            _f['branches'] = (cbk) => {
                var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
                var uri_a = gitRecord.gitHub.match(regex);
                var uri = uri_a[1] + '://' + ((!gitRecord.userName) ? '' : 
                    (encodeURIComponent(gitRecord.userName) + ':' + encodeURIComponent(gitRecord.password) + '@'));
                for (var i=4; i < uri_a.length; i++) {
                    uri +=  uri_a[i];
                }
                var cmd = 'git version && git config --global credential.helper gnome-keyring && git ls-remote ' + uri;
    
                exec(cmd, {maxBuffer: 128 * 1024},
                    (error, stdout, stderr) => {
                        var branches = [];
                        if (!error) {
                            var list = stdout.split(/\s+/);
                            for (var i in list) {
                                let regs = /^refs\/heads\//i;
                                if (regs.test(list[i])) {
                                    branches.push(list[i].replace(regs, ''));
                                }
                            }
                            cbk((!branches.length) ? {status: 'failure', message : 'Wrong resource!'} :
                             {status: 'success', uri:uri, branches : branches});
                        } else {
                            cbk({status: 'failure', message: error.message});
                        }
                });
            }
           
            _f['dockerSetting'] = (cbk) => {
                if (!CP.data.branches || CP.data.branches.status !== 'success') {
                    cbk(false);
                    return true;
                } else {
                    let uri =  CP.data.branches.uri;
                    var cmd = 'rm -fr ' + tmp_dir + ' && mkdir -p ' + tmp_dir + ' && cd ' + tmp_dir + ' && git clone ' + uri + ' . && git branch';
                    exec(cmd, {maxBuffer: 128 * 1024},
                        function(error, stdout, stderr) {
                            const fn = tmp_dir + '/dockerSetting/config.json';
                            pkg.readJson(fn, (setting) => {
                                cbk((!Object.keys(setting).length) ? false : setting);
                            });
                    });
                }
  
            }
            
            _f['defaultBranch'] = (cbk) => {
                if (!CP.data.dockerSetting) {
                    cbk(false);
                    return true;
                } else {
                    let cmd = 'cd ' + tmp_dir + ' && git branch',
                        branch = '';
                    exec(cmd, {maxBuffer: 128 * 1024},
                        function(error, stdout, stderr) {
                            var list = stdout.split(/(\n|\r)/);
                            for (var i in list) {
                                let regs = /^\*/i;
                                if (regs.test(list[i])) {
                                    branch = list[i].replace(/\*/gm, '').replace(/\*|^\s+|\s+$/gm,'');
                                    break;
                                }
                            }
                            cbk(branch);
                    });
                }
  
            }

            _f['removeTmpDir'] = (cbk) => {
                if (!CP.data.branches || CP.data.branches.status !== 'success') {
                    cbk(false);

                } else {
                    var cmd = 'rm -fr ' + tmp_dir;
                    exec(cmd, {maxBuffer: 128 * 1024},
                        function(error, stdout, stderr) {
                            cbk(true)
                    });
                }
            }

            CP.serial(_f, (dataCP) => {
                let result = {};
                if (!repo) {
                    result = {status : 'failure', message : 'Wrong gitHub format'};
                } else if (CP.data.branches.status !== 'success') {
                    result = {status : 'failure', message : CP.data.branches.message};
                } else if (!CP.data.dockerSetting) {
                    result = {status : 'failure', message : 'Missing dockerSetting on the repository'};
                } else {
                    result = (CP.data.branches.status !== 'success') ? {status : 'failure', message : CP.data.branches.message} : 
                    {status : 'success', hashCode: CP.data.hashCode, branches : CP.data.branches.branches, repo : repo, 
                    branch : CP.data.defaultBranch,
                    dockerSetting : CP.data.dockerSetting};
                }
                callback(result);
            }, 30000);

        }

        me.gitCloneToFolder = (dirn, gitRecord, callback) => {     
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

            exec(cmd, {maxBuffer: 224 * 2048},
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