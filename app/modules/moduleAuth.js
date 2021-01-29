(function() {
    var exec = require('child_process').exec;
    const SESSION_TIMEOUT = 6000000;
    var obj = function(env, pkg) {
        var me = this,
            fs = require('fs'),
            exec = require('child_process').exec,
            CP = new pkg.crowdProcess(),
            fn = '/var/_localAppData/authData.json',
            fnToken = '/var/_localAppData/authToken.json';

        var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        me.action = (data, callback) => {
            switch(data.code) {
                case 'isAuthReady' :
                    callback({status:'success', isAuthReady : me.isAuthReady()});
                    break;

                case 'initPassword' :
                    me.initPassword(data.password, callback);
                    break;

                case 'signin' :
                    me.signin(data.password, callback);
                    break;

                case 'isTokenLogin' :
                    me.isTokenLogin(data.authToken, callback);
                    break;               

                default:
                    callback({status:'failure', message : '404 wrong code of auth!' + data.code});
                    break;
            
            }
        };
        me.isAuthReady = () => {
            let auth = {};
            try {
                auth = pkg.require(fn);
            } catch (e) {

            }
            return (auth.root) ? true : false;
        };
        me.initPassword = (str, callback) => {
            let auth = {};
            try {
                auth = pkg.require(fn);
            } catch (e) {}
            
            auth['root'] = pkg.md5(str);
            fs.writeFile(fn, JSON.stringify(auth), 
                (err) => {
                    callback({status:'success'});
                });
        };

        me.signin = (password, callback) => {
            let auth = {}, authToken = {};
            try {
                auth = pkg.require(fn);
            } catch (e) {}

            try {
                authToken = pkg.require(fnToken);
            } catch (e) {}

            if (auth['root'] === pkg.md5(password)) {
                let token = 'TK_' + pkg.md5(new Date().getTime());
 
                for (var o in authToken) {
                    if (new Date().getTime() - authToken[o] > SESSION_TIMEOUT) {
                       delete authToken[o];
                    }
                }
                authToken[token] = new Date().getTime();
                fs.writeFile(fnToken , JSON.stringify(authToken), 
                (err) => {
                    callback({status: 'success', token : token});
                });
                
            } else {
                callback({status: 'failure', message : 'Wrong password ' + password + '!'});
            }
        };

        me.isTokenLogin = (token, callback) => {
            let authToken = {};
            try {
                authToken = pkg.require(fnToken);
            } catch (e) {}
            for (var o in authToken) {
                if (new Date().getTime() - authToken[o] > SESSION_TIMEOUT) {
                   delete authToken[o];
                }
            }
            if (authToken[token]) {
                authToken[token] = new Date().getTime();
                fs.writeFile(fnToken, JSON.stringify(authToken), 
                (err) => {
                    callback({status: 'success', token : token});
                });
            }
        };
        
        mes.refreshAuthToken = (token, callback) => {
            let authToken = {};
            try {
                authToken = pkg.require(fnToken);
            } catch (e) {}
            if (token && authToken[token]) {
                authToken[token] = new Date().getTime();
                fs.writeFile(fnToken, JSON.stringify(authToken), 
                (err) => {
                    callback();
                });
            } else {
                callback();
            }
        };

        me.removeLoginToken = (token, callback) => {

        };
        me.cleanOvertime = (callback) => {

        };
    }
    module.exports = obj;
})()