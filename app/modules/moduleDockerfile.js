(function() {
    var obj = function(env, pkg) {
        var me = this;
        var fs = require('fs');
        var CP = new pkg.crowdProcess();
        var baseDir = '/var/_publicDockers';

        this.loadPublicDockersList = (callback) => {
            var _f = {};
            fs.readdir(baseDir, (err, files) => {
                var list = [];
                for (var i in files) {
                    _f['info_' + i] = (function(i) {
                        return function(cbk) {
                           if (files[i] === 'admin_dockerfile') {
                               cbk(true);
                           } else {
                                me.getDescription(files[i],
                                    function(err, data) {
                                    if (!err) {
                                        let setting = {};
                                        try {
                                            setting = pkg.require(baseDir + '/' + files[i] + '/config.json');
                                        } catch (e) {

                                        }
                                        list.push({code : files[i], title: data.title, description : data.description, setting : setting});
                                    }
                                    cbk(true);
                                });
                           }
                        }
                    })(i);

                }
                
                CP.serial(_f, function(data) {
                    callback(list);
                }, 30000);
            });
        }

        this.getTitle = (dirn, callback) => {
            fs.readFile(baseDir + '/' + dirn + '/title.txt', 'utf8', function(err, contents) {
                var title = (!err) ? contents.replace(/(\r|\n|\r\n|\n\r)/g, '') : '';
                callback(err, title);
            });
        }

        this.getDescription = (dirn, callback) => {
            me.getTitle(dirn, (err0, title) => {
                fs.readFile(baseDir + '/' + dirn + '/description', 'utf8', function(err, contents) {
                    var description = (!err) ? contents.replace(/(\r|\n|\r\n|\n\r)/g, '<br/>') : '';
                    callback(err, {title: (err0) ? dirn : title, description : description});
                });
            })
        }
    }

    module.exports = obj;
})()