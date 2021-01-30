(function() {
    var obj = function(req, res) {
        const   me = this;
        me.inside = {
            root : '/var/_localRoot',
            app  : '/var/_localApp',
            data : '/var/_localAppData',
            key  : '/var/_localAppKey'
        }

        me.outside = {
            root : '/var/_localRoot',
            app  : '/var/_localApp',
            data : '/var/_localAppData',
            key  : '/var/_localAppKey'
        }

        me.file = {
            authData    : me.inside.key + '/authData.json',
            authToken   : me.inside.key + '/authToken.json',
            gridStatus  : me.inside.key +  '/_gridMatrix.json',
            gridServer  : me.inside.key +  '/_gridServers.json',
            gridToken   : me.inside.key + '/_gridToken',
            gridOldToken: me.inside.key + '/_gridOldToken'
        }

        me.SESSION_TIMEOUT = 600000;

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