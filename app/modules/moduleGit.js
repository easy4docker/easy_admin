(function() {
    var exec = require('child_process').exec;
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess();

        
        this.gitSwitchBranch = (serverName, branch, callback) => {
            var dirn = '/var/_localAppData/sites/' + serverName;
            var cmd = 'cd ' + dirn + ' && git checkout ' + branch;
            exec(cmd, {maxBuffer: 224 * 2048},
                function(error, stdout, stderr) {
                    callback({status : 'success'});                       
            });
        }

        this.gitRemoteBranchs = (gitRecord, callback) => {

            var _f = {};
            _f['repo'] = (cbk) => {
                const regex = /([^/]+)\.git$/;
                var uri_a = gitRecord.gitHub.match(regex);
                cbk((!uri_a) ? '' :uri_a[1]);
            }
            _f['branches'] = function(cbk) {
                var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
                var uri_a = gitRecord.gitHub.match(regex);
                var uri = uri_a[1] + '://' + ((!gitRecord.userName) ? '' : 
                    (encodeURIComponent(gitRecord.userName) + ':' + encodeURIComponent(gitRecord.password) + '@'));
                for (var i=4; i < uri_a.length; i++) {
                    uri +=  uri_a[i];
                }
                var cmd = 'git ls-remote ' + uri;
                exec(cmd, {maxBuffer: 256 * 2048},
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
                            cbk((!branches.length) ? {status: 'failure', message : 'Wrong resource!'} :
                             {status: 'success', branches : branches});
                        } else {
                            cbk({status: 'failure', message: error.message});
                        }
                });
            }

            CP.serial(_f, (dataCP) => {
                callback((CP.data.branches.status !== 'success') ? {status : 'failure', message : CP.data.branches.message} : 
                    {status : 'success', branches : CP.data.branches.branches, repo : CP.data.repo});
            }, 30000);

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