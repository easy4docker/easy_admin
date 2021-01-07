(function () { //
	var obj =  function (env, pkg, req, res) {
		let fs = require('fs'),
			exec = require('child_process').exec,
			CP = new pkg.crowdProcess(),
			me = this;
		me.call = () => {
			let p = req.url;
			mp = p.match(/\/([^\/]+)\/([^\/]+)$/);
			if (!mp || !mp[2]) {
				res.render('html/page404.ect');
				return true;
			}

			me.env = {
				"root":env.root,
				"dataFolder":env.dataFolder + '/backendCloud/' + mp[2] + '/data',
				"appFolder":env.dataFolder+ '/backendCloud/' + mp[2] + '/code'
			};
			fs.stat(fn, function(err, stat) {
				if(err == null) {
					me.pageGet();
				} else  {
					res.render('html/page404.ect');
				}
			});
            return true;
		}
		this.pageGet = ()=> {
			var _tokens = me.getTokens();
			var token=req.query.token;
			if ((!token || !_tokens || !_tokens.list || !_tokens.list[token])  && !(/^\/(css|js|images)\//ig.test(p))) {
				res.sendFile(env.root  + '/www/page401.html');
			} else {
				let fn = (/\/$/.test(req.url)) ? (env.root + '/views' + p + 'index.ect') : (env.root + '/www' + p);
				if (!/\.ect$/.test(fn)) {
					let m = fn.match(/\.(html|js|css|jsx|vue|txt|vue)$/ig);
					fs.stat(fn, function(err, stat) {
						if(err == null) {
							if (!m || !m[0]) {
								res.sendFile(fn);
							} else {
								fs.readFile(fn, 'utf-8', (err, data)=> {
									me.sendHeader(m[0].replace(/\./,''));
									res.send((err) ? err.message : data);
								});
							}
						} else  {
							res.sendFile(env.root  + '/www/page404.html');
						}
					});
				} else {
					res.render(fn, req.query);
				}
			}
		}
		me.askBackendStatus = (data) => {
			const dirTree = pkg.require(env.root + '/vendor/directory-tree/node_modules/directory-tree');
			const _f = {};
			_f['localScripts'] = (cbk) => {
				const tree = dirTree(me.env.appFolder);
				cbk((!tree) ? null : tree.children);
			}
			
			_f['scheduledTasks'] = (cbk) => {

				const tree = dirTree(me.env.dataFolder + '/scheduledTasks');
				cbk(me.getCronSetting());
				// cbk((!tree) ? (env.dataFolder + '/scheduledTasks') : tree.children);
			}
			_f['logs'] = (cbk) => {

				const tree = dirTree(env.dataFolder + '/_log');
				cbk((!tree) ? (env.dataFolder + '/_log') : tree.children);
			}
			_f['outputs'] = (cbk) => {

				const tree = dirTree(env.dataFolder + '/_output');
				cbk((!tree) ? (env.dataFolder + '/_output') : tree.children);
			}
			
			CP.serial(_f, (data) => {
				res.send({
					localScripts : CP.data.localScripts,
					scheduledTasks : CP.data.scheduledTasks, 
					logs : CP.data.logs, 
					outputs : CP.data.outputs
				});
			}, 6000);
			
		}
		me.removeCron = (data) => {
			const _f = {};
			_f['deleteFile'] = (cbk) => {
				const fn = me.env.dataFolder + '/scheduledTasks/' + data.fileName;
				exec('rm -fr ' + fn, {maxBuffer: 1024 * 2048},
				function(error, stdout, stderr) {
					cbk(true);
				});
			}
			_f['removeCron'] = (cbk) => {
				let cmd = 'sed /' + data.fileName.replace(/[-\/\\^$*+?.()|[\]{}_]/g, '\\$&') + '/d /etc/crontab > /etc/tmp_crontab';
				cmd += ' && cp -f /etc/tmp_crontab /etc/crontab && rm /etc/tmp_crontab';

				const fnc = env.dataFolder + '/_cron/xc_' + new Date().getTime() + '.sh';
					
				fs.writeFile(fnc, cmd, (errp) => {
					cbk(true);
				});
			}
			_f['removeConfig'] = (cbk) => {
				me.removeCronSetting(data.fileName, (errp) => {
					cbk(true);
				});
			}
			CP.serial(_f, (data) => {
				res.send({status : 'success', cmp : CP.data.removeCron});
			}, 6000);
		}
		me.deleteFile = (data) => {
			switch (data.type) {
				case 'log':
					const fn = me.env.dataFolder + '/_log/' + data.fileName;
					exec('rm -fr ' + fn, {maxBuffer: 1024 * 2048},
					function(error, stdout, stderr) {
						res.send({status : 'success'});
					});
					break;
				default:
					res.send({status : 'failure', message : 'Missing or wrong type!'});
			}
		}

		me.pullGitCode = (data) => {
			exec('cd ' + me.env.appFolder + ' && git pull', {maxBuffer: 1024 * 2048},
			function(error, stdout, stderr) {
				res.send({status : 'success'});
			});
		}

		me.sendHeader = (filetype) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.header('Access-Control-Allow-Headers', 'Content-Type'); 
			if (filetype == 'js' || filetype == 'jsx' || filetype == 'vue') {
				res.setHeader('Content-Type', "text/javascrip");
			} else if (filetype == 'css') {
				res.setHeader('Content-Type', "text/css");
			} else {
				res.setHeader('Content-Type', "text/plain");
			}			
		}
		me.loadFileContent = (data) => {
			var folderName = (data.fileType == "log") ? '/_log/' : '/scheduledTasks/'; 
			const fn = me.env.dataFolder + folderName + data.fileName;

			fs.stat(fn, function(err, stat) {
				if(err == null) {
					me.sendHeader('');
					res.sendFile(fn);
				} else  {
					res.sendFile(env.root  + '/www/page404.html');
				}
			});
		}

		me.askLogContent = (data) => {
			const fn = me.env.dataFolder + '/_log/' + data.fileName;

			fs.stat(fn, function(err, stat) {
				if(err == null) {
					me.sendHeader('');
					res.sendFile(fn);
				} else  {
					res.sendFile(env.root  + '/www/page404.html');
				}
			});
		}
		me.askOutput = (data) => {
			const fn = me.env.dataFolder + '/_output/' + data.fileName;

			fs.stat(fn, function(err, stat) {
				if(err == null) {
					me.sendHeader('');
					res.sendFile(fn);
				} else  {
					res.sendFile(env.root  + '/www/page404.html');
				}
			});
		}
		me.getCronSetting = () => {
			let cronSetting = {}, cronSettingFn = me.env.dataFolder + '/cronSetting.json';
			try {
				cronSetting = pkg.require(cronSettingFn);
			} catch (e) {}
			return cronSetting;
		}
		me.saveCronSetting = (fn, data, callback) => {
			let cronSettingFn = me.env.dataFolder + '/cronSetting.json';
			let cronSetting = me.getCronSetting();
			cronSetting[fn] = data;
			fs.writeFile(cronSettingFn, JSON.stringify(cronSetting), (err) => {
				callback();
			});
		}
		me.removeCronSetting = (fn, callback) => {
			let cronSettingFn = me.env.dataFolder + '/cronSetting.json';
			let cronSetting = me.getCronSetting();
			delete cronSetting[fn];
			fs.writeFile(cronSettingFn, JSON.stringify(cronSetting), (err) => {
				callback();
			});
		}
		me.saveTask = (data) => {
			const dirn = me.env.dataFolder + '/scheduledTasks';
			const dirnCron = me.env.dataFolder + '/_cron';

			const _f = {};
			_f['createDir'] = (cbk) => {
				exec('mkdir -p ' + dirn, {maxBuffer: 1024 * 2048},
					function(error, stdout, stderr) {
						cbk(true);
					}
				)
			}
			
			_f['copyFile'] = (cbk) => {
				if (data.type !== 'C') {
					const fn = dirnCron + '/xc_' + new Date().getTime() + '.sh';
					fs.writeFile(fn, data.command, (err) => {
						if (err) {
							cbk(err.message);
						} else {
							cbk(true);
						}
					});
				} else {
					const fnc = dirnCron + '/xe_' + new Date().getTime() + '.sh';
					const fnp0 = 'xp_' + new Date().getTime() + '.sh';
					const fnp = dirn +  '/' + fnp0;

					let cron_shell = 'echo "=== CRON RUN $(date +"%m-%d %H:%M:%S") ===' + '" >> ' + me.env.dataFolder + '/_log/cron.log' + " ===\n";
					cron_shell += 'cd /var/_localApp'+ "\n";
					cron_shell += data.command + " | sed 's/^/\t>>\t/'"+ ' >> ' + me.env.dataFolder + '/_log/cron.log'+ "\n";
					cron_shell += 'echo "\tCRON Done $(date +"%m-%d %H:%M:%S") '  + '" >> ' + me.env.dataFolder + '/_log/cron.log' + "\n\n";

					let cmd = 'echo "Add cron job ' + fnp0 + '\n" && ';
					cmd += 'echo "' + data.schedule + ' root (sh ' + fnp + ')" >> /etc/crontab ';
					
					const cronSetting = {
						name 	: data.name,
						command : data.command,
						schedule : data.schedule
					};
					me.saveCronSetting(fnp0, cronSetting, (d)=> {
						fs.writeFile(fnp, cron_shell, (errp) => {
							fs.writeFile(fnc, cmd, (err) => {
								if (err) {
									cbk(err.message);
								} else {
									cbk(true);
								}
							});
						});
					});
				}
			}
			CP.serial(_f, (data) => {
				res.send(CP.data['copyFile']);
			}, 12000);
		}
	};
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 

})();
