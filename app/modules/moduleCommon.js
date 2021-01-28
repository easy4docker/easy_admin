(function() {
    var obj = function(env, pkg, req, res) {
        const   me = this,
                git_root = '/var/_localRoot',
                app_dir = '/var/_localApp',
                data_dir = '/var/_localAppData',
                key_dir = '/var/_localAppKey',
                gridStatusFn = data_dir + '/_gridMatrix.json',
                gridServerFn = key_dir + '/_gridServers.json',
                gridTokenFn = key_dir + '/_gridToken',
                gridOldTokenFn = key_dir + '/_gridOldToken';
        me.sendErrorJson = (message) => {
            res.send({status:'failure', code: '404', message : message});
        }
        me.output = (data) => {
            res.send(data);
        }
        me.sendAction = (code, message) => {
            res.send({status:'failure', action: code, message : message});
        }
    }
    module.exports = obj;
})()