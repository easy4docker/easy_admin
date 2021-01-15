(function() {
    var obj = function(env, pkg, req, res) {
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

        me.post = () => {
            
			if (typeof me[req.body.cmd] === 'function') {
				me[req.body.cmd]();
			} else {
                res.send({status:'failure', message : '404 wrong cmd ' + req.body.cmd + ' !'});
			}

        };
        me.getGridMatrix = () => {
            res.send({status: 'successA', result: 'me.dataGridMatrix()'});
        }

    }
    module.exports = obj;
})()
