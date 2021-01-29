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

        me.fn = {
            authToken   : me.inside.data + '/authToken.json',
            gridStatus  : me.inside.data +  '/authToken.json'
        }

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