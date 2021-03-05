(function () { //
	var obj =  function (env, pkg, req, res) {
		var me = this;
		var fs = require('fs');
		var path = require('path');

		me.route = (rest) => {
			if (rest === 'get') {
				me.get();
			} else {
				me.post();
			}
		}

		me.get = () => {
			let p = req.params[0],
				mp = p.match(/\/([^\/]+)(\/|$)/);

			if (mp && mp[1] === '_setupGridServer') {
				fs.readFile(env.dataFolder  + '/_ip', 'utf-8', (err, ipData) => {
					res.render(env.root  + '/views/shellScriptSample/setup.sh.ect', {gridIp:ipData.replace(/(\n|\r)/ig, '')});
				});
				return true;
			}
			if (mp && mp[1] === '_grid') {
				var MGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
				let mGrid =  new MGrid(env, pkg, req, res);
				mGrid.call('get', true);
				return true;
			}

			if (mp && mp[1] === '_cloud') {
				var MCloud= pkg.require(env.root+ '/modules/moduleCloud.js');
				let mc =  new MCloud(env, pkg, req, res);
				mc.call();
				return true;
			}

			if (mp && mp[1] === 'spa-package') {
				let SPA = pkg.require(__dirname + '/appSpaPackage.js');
				let spa= new SPA(env, pkg, req, res);
				spa.call(p);
				return true
			}

			if (mp && mp[1] === 'api') {
				var MApi= pkg.require(env.root+ '/modules/moduleApi.js');
				let api =  new MApi(env, pkg, req, res);
				api.call('get', false);
				return true
			}

			if (p == '/') {
				var fn = env.root + '/www/index.html';
				res.sendFile(fn);
				return true
			} else {
				if (!/\.ect$/.test(p)) {
					var fn = env.root + '/www' + p;
					fs.stat(fn, function(err, stat) {
						if(err == null) {
							res.sendFile(fn);
						} else  {
							res.render(env.root  + '/views/html/page404.ect');
						}
					});
				} else {
					me.sendEctWithToken(p); 
				}
			}
		};

		me.sendEctWithToken = (p) => {
			res.render(env.root  + '/views' + p, req.query);
		};
	
		me.refreshTokenSend = (data) => {
			var MAuth= pkg.require(env.root+ '/modules/moduleAuth.js');
			var auth = new MAuth(env, pkg, req, res);
			auth.refreshAuthToken(
				req.body.authToken,
				() => {
					res.send(data);
				}
			)
		};
		me.post = () => {

			let p = req.params[0],
				mp = p.match(/\/([^\/]+)(\/|$)/);
			if (mp) {
				switch(mp[1]) {
					case '_dockerAdupter':
						var MAdupter= pkg.require(env.root+ '/modules/moduleAdupter.js');
						let maupter =  new MAdupter(env, pkg, req, res);
						maupter.call();
						break;
					case '_grid':
						var MAGrid= pkg.require(env.root+ '/modules/moduleGrid.js');
						let mGrid =  new MAGrid(env, pkg, req, res);
						mGrid.call('post', false);
						break; 
					case '_gridHub':
						var MAGridHub= pkg.require(env.root+ '/modules/moduleGridHub.js');
						let mGridHub =  new MAGridHub(env, pkg, req, res);
						mGridHub.post();
						break; 

					case 'api':
						var MApi= pkg.require(env.root+ '/modules/moduleApi.js');
						let api =  new MApi(env, pkg, req, res);
						api.call('post', false);
						break;
					default:
						res.send({status:'failure', message : '404 wrong path ' + p + '!'});
				}		
			} else {
				res.render(env.root  + '/views/html/page404.ect');
				return true	
			}
		};

		me.sendFile = (fn) => {
			fs.stat(fn, function(err, stat) {
				if(err == null) {
					res.sendFile(fn);
				} else  {
					var fn_plus = env.root + '/views/html/' + path.basename(fn) + '.ect';
					fs.stat(fn_plus, function(err1, stat1) {
						if(err1 == null) {
							res.render('html/' + path.basename(fn_plus));
						} else {
							res.render('html/page404.ect');
						}
					});
				}
		    });
		}
	};
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 

})();
