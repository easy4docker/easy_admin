(function() {
    var obj = function(env) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js');

        me.onDemand = (server, configFile, cbk) => {
            me.readJson(configFile, (data) => {
                if (typeof me[data.code]) {
                    me[data.code](server, data.param);
                } else {
                    console.log(data);
                }
            })
        };
        me.removeMe = (server, param) => {
            console.log(server + '===>');
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
