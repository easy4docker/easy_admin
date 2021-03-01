(function() {
    var obj = function(env, pkg, req, res) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec;

        var _env = {};
        try {
            _env = require(data_dir + '/_env.json');
        } catch (e) {}

        me.runUpload = () => {
            res.send(req.files);
        }
    }
    module.exports = obj;
})()
