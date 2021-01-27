(function() {
    var obj = function(env, pkg, req, res) {
        const me = this;
        me.sendErrorJson = (message) => {
            res.send({status:'failure', code: '404', message : message});
        }
    }
    module.exports = obj;
})()