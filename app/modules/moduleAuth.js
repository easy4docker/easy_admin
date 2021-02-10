(function() {
    var obj = function(env, pkg, req, res) {
        var me = this,
            fs = require('fs');

        var MCommon= pkg.require(env.root+ '/modules/moduleCommon.js');
        me.comm = new MCommon(req, res);

        var fnToken = me.comm.file.authToken,
            authDataFn = me.comm.file.authData;
        
        me.action = (data, callback) => {
            switch(data.code) {
                case 'isAuthReady' :
                    me.isAuthReady(callback);
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

                case 'signOff' :
                    me.signOff(data.authToken, callback);
                    break; 

                default:
                    callback({status:'failure', message : '404 wrong code of auth!' + data.code});
                    break;
            
            }
        };
        me.isAuthReady = (callback) => {
            pkg.readJson(authDataFn, (authToken) => {
                callback({status:'success', isAuthReady :(!authToken || !Object.keys(authToken).length) ? false : true});
            });
        };
        me.initPassword = (str, callback) => {
            pkg.readJson(authDataFn, (auth) => {
                auth['root'] = pkg.md5(str);
                fs.writeFile(authDataFn, JSON.stringify(auth), 
                    (err) => {
                        callback({status:'success'});
                    });
            });
        };

        me.signin = (password, callback) => {
            pkg.readJson(authDataFn,  (auth) => {
                if (auth['root'] === pkg.md5(password)) {
                    let token = 'TK_' + pkg.md5(new Date().getTime());
                    pkg.readJson(fnToken, (authToken) => {
                            authToken[token] = new Date().getTime();
                            fs.writeFile(fnToken , JSON.stringify(authToken), 
                            (err) => {
                                callback({status: 'success', token : token});
                            });
                        });
                } else {
                    callback({status: 'failure', message : 'Wrong password ' + password + '!'});
                }
            });
        };

        me.signOff = (token, callback) => {
            pkg.readJson(fnToken,  (authToken) => {
                delete authToken[token];
                fs.writeFile(fnToken , JSON.stringify(authToken), (err) => {
                    callback({status: 'success'});
                });
            });
        };

        me.isTokenLogin = (token, callback) => {
            me.refreshAuthToken(token, () => {
                pkg.readJson(fnToken, (authToken) => {
                    callback((authToken[token])? {status: 'success', token : token} : {status: 'failure'});
                });
            });
        };
        
        me.refreshAuthToken = (token, callback) => {
            pkg.readJson(fnToken,(authToken) => {
                let changed = false;
                for (var o in authToken) {
                    if ((new Date().getTime() - authToken[o]) > me.comm.SESSION_TIMEOUT) {
                        delete authToken[o];
                        changed = true;
                    }
                }
                if (authToken[token]) {
                    authToken[token] = new Date().getTime();
                    changed = true;
                }
                if (!changed) {
                    callback();
                } else {
                    fs.writeFile(fnToken, JSON.stringify(authToken), (err) => {
                        callback();
                    });
                }
            });
        };
    }
    module.exports = obj;
})()