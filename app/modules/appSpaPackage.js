(function () { 
	var obj =  function (env, pkg, req, res) {
        var fs = require('fs'),
            me = this,
			dirPatt = /\/spa\-package\//;
		this.call = function(p) {
			let spaDir = env.appFolder + '/www/js/package/';
			let cfgFn = spaDir + p.replace(dirPatt, '');
			let fileAttr = me.getConfigAttr(cfgFn);
			let cfg = {};
			try {
				cfg = pkg.require(fileAttr.fileName);
			} catch (e) {}
			me.sendHeader(fileAttr.type);

			if (fileAttr.type.indexOf(['vue']) !== -1) {
				me.packVueFile(cfg);
				return true;
			}

			if (fileAttr.type.indexOf(['js']) !== -1) {
				me.packJsFile(cfg);
				return true;
			}

			if (fileAttr.type.indexOf(['css']) !== -1) {
				me.packCssFile(cfg);
				return true;
			} 
			me.packJsFile(cfg);
		};

		this.packCssFile = function(cfg) {
			var codeStr = '';
			var _f = {},
				appDir = env.appFolder + '/www';

			if (cfg.CSS) {
				for (var k in cfg.CSS) {
					_f['C_' + k] = (function(k) {
						return function(cbk) {
							fs.readFile(appDir + cfg.CSS[k], 'utf-8', (err, data)=> {
								cbk((err) ? false : data);
							});
						}
					})(k)
				}
			}
			var cp = new pkg.crowdProcess();
			cp.serial(
				_f,
				function(data) {
					codeStr += "/* ====== CSS code ====== */ \n"
					for (var k in cfg.CSS) {
						codeStr += "/* --> " + cfg.CSS[k] + " */ \n\n";
						if (cp.data['C_' + k] !== false) {
							codeStr += cp.data['C_' + k] + "\n\n";
						}
					}
					res.send(codeStr);
			}, 6000);
		}

		this.packVueFile = function(cfg) {
			var codeStr = 'if (!_TPL) var _TPL = {};' + "\n";
			codeStr += 'if (!_TPL.vue) _TPL.vue = {};' + "\n";
			var _f = {},
				appDir = env.appFolder + '/www';
			if (cfg.TPL) {
				for (var k in cfg.TPL) {
					_f['A_' + k] = (function(k) {
						return function(cbk) {
							fs.readFile(appDir + cfg.TPL[k], 'utf-8', (err, data)=> {
								cbk((err) ? false : data);
							});
						}
					})(k)
				}
			}
			if (cfg.JS) {
				for (var k in cfg.JS) {
					_f['B_' + k] = (function(k) {
						return function(cbk) {
							fs.readFile(appDir + cfg.JS[k], 'utf-8', (err, data)=> {
								cbk((err) ? false : data);
							});
						}
					})(k)
				}
			}
			var cp = new pkg.crowdProcess();
			cp.serial(
				_f,
				function(data) {
					codeStr += "/* ====== TPL code ====== */ \n"
					for (var k in cfg.TPL) {
						codeStr += "/* --> " + cfg.TPL[k] + " */ \n\n";

						if (!cfg.TPL[k]) {
							continue;
						} else {
							let uri = cfg.TPL[k].replace(/\/([^/]+)$/, '/');

							if (cp.data['A_' + k] !== false) {
								codeStr += '_TPL.vue["' + cfg.TPL[k] + '"] = "' + 'data:text/plain;[' + uri +']' + encodeURIComponent(cp.data['A_' + k]) + '";' + "\n\n";
							}
						}
					}
					codeStr += "/* ====== JS code ====== */ \n"
					for (var k in cfg.JS) {
						codeStr += "/* --> " + cfg.JS[k] + " */ \n\n";
						if (cp.data['B_' + k] !== false) {
							codeStr += cp.data['B_' + k] + "\n\n";
						}
					}
					res.send(codeStr);
			}, 6000);
		}

		this.packJsFile = function(cfg) {
			var codeStr = 'if (!_TPL) var _TPL = {};' + "\n";
			codeStr += 'if (!_TPL.js) _TPL.js= {};' + "\n";
			var _f = {},
				appDir = env.appFolder + '/www';
			if (cfg.TPL) {
				for (var k in cfg.TPL) {
					_f['A_' + k] = (function(k) {
						return function(cbk) {
							fs.readFile(appDir + cfg.TPL[k], 'utf-8', (err, data)=> {
								cbk((err) ? false : data);
							});
						}
					})(k)
				}
			}
			if (cfg.JS) {
				for (var k in cfg.JS) {
					_f['B_' + k] = (function(k) {
						return function(cbk) {
							fs.readFile(appDir + cfg.JS[k], 'utf-8', (err, data)=> {
								cbk((err) ? false : data);
							});
						}
					})(k)
				}
			}
			var cp = new pkg.crowdProcess();
			cp.serial(
				_f,
				function(data) {
					codeStr += "/* ====== TPL code ====== */ \n"
					for (var k in cfg.TPL) {
						codeStr += "/* --> " + cfg.TPL[k] + " */ \n\n";
						if (cp.data['A_' + k] !== false) {
							codeStr += '_TPL.js["' + cfg.TPL[k] + '"] = "' + encodeURIComponent(cp.data['A_' + k]) + '";' + "\n\n";
						}
					}
					codeStr += "/* ====== JS code ====== */ \n"
					for (var k in cfg.JS) {
						codeStr += "/* --> " + cfg.JS[k] + " */ \n\n";
						if (cp.data['B_' + k] !== false) {
							codeStr += cp.data['B_' + k] + "\n\n";
						}
					}
					res.send(codeStr);
			}, 6000);
		}
		this.getConfigAttr = (fn) => {
			let patt = /(\.min|)\.(vue|js|css|jsx)$/i;
			let v = fn.match(patt);
			return (!v)? {} : {
				'isMini' 	: (v[1]) ? true : false,
				'type'		: (v[2]) ? v[2] : '',
				'fileName'	: (!v[2]) ? fn : (fn.replace(patt, '.') + v[2] + '.json')
			};
		};
		this.sendHeader = (filetype) => {
			var me = this;
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.header('Access-Control-Allow-Headers', 'Content-Type'); 
			if (filetype == 'js' || filetype == 'jsx' || filetype == 'vue') {
				res.setHeader('Content-Type', "text/javascrip");
			} else if (filetype == 'css') {
				me.is_css = true;
				res.setHeader('Content-Type', "text/css");
			} else {
				res.setHeader('Content-Type', "text/plain");
			}			
		}
	};
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 

})();
