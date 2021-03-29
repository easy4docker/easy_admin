(function () { 
	var obj =  function (env, pkg) {
        const 	me = this,
				fs = require('fs'),
				exec = require('child_process').exec;

		me.call = (postData, callback) => {
			switch(postData.cmd) {
				case 'removeResult' :
				case "getPenddingRequests" :
				case 'onDemandRequest' :	
				case 'getOnDemandResults' :
				case 'getResultFiles' :
				case 'getFileContent':
					me[postData.cmd](postData, (data) => {
						callback(data);
					});
					break;
				default:
					callback(postData);
			}
		};

		me.toHHMMSS = (seconds) => {
			if (!seconds) return '';
			let duration = seconds;
			let hours = duration / 3600;
			duration = duration % (3600);
		   
			let min = parseInt(duration / 60);
			duration = duration % (60);
		   
			let sec = parseInt(duration);
		   
			if (sec < 10) {
			  sec = `${sec}`;
			}
			if (min < 10) {
			  min = `${min}`;
			}
		   
			if (parseInt(hours, 10) > 0) {
			  return `${parseInt(hours, 10)}h ${min}m ${sec}s`
			}
			else if (min == 0) {
			  return `${sec}s`
			}
			else {
			  return `${min}m ${sec}s`
			}
		};

		
		me.getPaddingDir = (d, callback) => {
			fs.readdir(d, (err, list) => {
				list = list.filter((rec) => { return (rec[0] === '.') ? false: true});
				const _f = {};

				for (let o in list) {
					_f['p_' + o] = ((o) => {
						return (cbk) => {
							pkg.readJson(d + '/' + list[o], (jdt) => {
								const gitHub = (!jdt || !jdt.param || !jdt.param.gitHub) ? '' : jdt.param.gitHub;
								const regex = /([^/]+)\/([^/]+)\.git$/;
								const uri_a = gitHub.match(regex);
								const repo = ((!uri_a) ? false : (uri_a[1] + '_' + uri_a[2]));
								
								const t = parseInt(list[o].replace(/^([^\_]+)\_/, '').replace(/\.json$/, ''));
								const dt = new Date().getTime() - t;
								const data = {
									name : list[o],
									repo: repo,
									tm : me.toHHMMSS(parseInt(dt * 0.001 / 60))
								}
								cbk(data);
							});
						}
					})(o)
				}
				const cp = new pkg.crowdProcess();
				cp.serial(_f, (d) => {
					const rlist = [];
					for (let o in list) {
						
							rlist.push(cp.data['p_' + o]);
					
					}
					callback(rlist);
				}, 3000);
			});
		}

		me.getResultDir = (d, callback) => {
			fs.readdir(d, (err, list) => {
				list = list.filter((rec) => { return (rec[0] === '.') ? false: true});
				const _f = {};
				const resultIds = [];
				for (let o in list) {
					_f['p_' + o] = ((o) => {
						return (cbk) => {
							const a = list[o].match(/\_([0-9]+)$/);
							const t = parseInt(a[1]);
							resultIds.push(t)
							const dt = new Date().getTime() - t;
							const data = {
								resultId : t,
								name : list[o].replace(/\_([0-9]+)$/, ''),
								tm : me.toHHMMSS(parseInt(dt * 0.001 / 60))
							}
							cbk(data);
						}
					})(o)
				}
				const cp = new pkg.crowdProcess();
				cp.serial(_f, (d) => {
					const rlist = [];
					for (let o in list) {
						if ((cp.data['p_' + o]) && /^result\_/.test(cp.data['p_' + o].name)) {
							rlist.push(cp.data['p_' + o]);
						}
					}
					callback(rlist);
				}, 3000);
			});
		}

		me.getPenddingRequests = (postData, callback) => {
			const _f= {};
			_f['pendding'] = (cbk) => {
				me.getPaddingDir(env.dataFolder + '/_pendding', cbk);
			}
			_f['results'] = (cbk) => {
				me.getResultDir(env.sharedFolder, cbk);
			}
			const cp = new pkg.crowdProcess();
			cp.serial(_f, (dt) => {
				callback({status:'success', 
					requests: {
						pendding : cp.data.pendding.filter((v) => {  return (/^onDemand\_/.test(v.name)) ? true : false; }),
						offRoad  : cp.data.pendding.filter((v) => {  return (/^offRoad\_/.test(v.name)) ? true : false; }),
						results  : cp.data.results
					}
				});
			}, 30000)
		}

		me.removeResult = (postData, callback) => {
			const comStr = 'rm -fr ' + env.sharedFolder + '/' + postData.data.result;
			exec(comStr,  {maxBuffer: 224 * 2048}, function(err, stdout, stderr) {
				callback((!err) ? {status:'success'} : {status:'failure', message:err.mrssage});
			});
		}
		me.onDemandRequest= (postData, callback) => {
			const requestId = new Date().getTime(); 
			const data = {
				code		:'addOndemand',
				param 		: postData.data,
				requestId	: requestId,
				uploadId	: postData.uploadId
			}
			if (postData.uploadId) {
				data.uploadId = postData.uploadId;
			}
			if (!postData.data || ['onDemand', 'offRoad'].indexOf(postData.data.serviceType) === -1) {
				callback({status:'failure', message: 'wrong service type!'});
			} else {
				let cmd = 'mkdir -p ' + env.dataFolder + '/_pendding && ';
				cmd += 'mkdir -p ' + env.dataFolder + '/' + postData.data.serviceType;
				exec(cmd,  {maxBuffer: 224 * 2048}, (err, stdout, stderr) => {
					fs.writeFile(env.dataFolder + '/_pendding/' + postData.data.serviceType + '_' + requestId + '.json', JSON.stringify(data), (err, result) => {
						fs.writeFile(env.dataFolder + '/' + postData.data.serviceType + '/request_' + requestId + '.json', 
							JSON.stringify(data), (err, result) => {
							callback({status:'success'});
						})
					});
				});
			}
		}

		me.getOnDemandResults = (postData, callback) => {
			if (!postData) {
				callback({status:'failure', message : 'Missing postData'});
			} else {
				fs.readdir(env.sharedFolder, (err, list) => {
					callback({status:'success', result: (err) ? [] : list.filter(
						(rec) => { return (rec[0] === '.') ? false: true})});
				});
			}
		}
		me.getFileContent = (postData, callback) => {
			const dt = postData.data;
			const fn = env.sharedFolder + '/' + dt.ondemand + '/' + dt.ftype + '/' + dt.file;
			fs.readFile(fn, 'utf-8', (err, content) => {
				callback({status:'success', content : content});
			});
		}

		me.getResultFiles = (postData, callback) => {
			if (!postData || !postData.data || !postData.data.result) {
				callback({status:'failure', message : 'Missing postData.data.result'});
				return true;
			}
			const _f = {};
			_f['input'] = (cbk) => {
				fs.readdir(env.sharedFolder + '/' + postData.data.result +  '/input', (err, list) => {
					cbk((err) ? [] : list.filter(
						(rec) => { return (rec[0] === '.') ? false: true}));
				});
			}
			_f['output'] = (cbk) => {
				fs.readdir(env.sharedFolder + '/' + postData.data.result + '/output', (err, list) => {
					cbk((err) ? [] : list.filter(
						(rec) => { return (rec[0] === '.') ? false: true}));
				});
			}
			const cp = new pkg.crowdProcess();
			cp.serial(_f, (result) => {
				callback({status:'success', files :{
					input  : cp.data.input,
					output : cp.data.output
				}});
			}, 3000)
		}
	};
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
})();
