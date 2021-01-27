(function() {
    var obj = function(env, pkg, req, res) {
        const me = this;
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