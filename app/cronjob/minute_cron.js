const env = {
        root : __dirname,
        dataFolder  : '/var/_localAppData',
        appFolder   : '/var/_localApp',
        keyFolder   : '/var/_localAppKey'
      },
      fs = require('fs'),
      CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js');

delete require.cache[__dirname + '/modules/moduleServer.js'];
const MServer = require(__dirname + '/modules/moduleServer.js');

fs.readdir(env.dataFolder + '/sites', (err, list) => {
  const _f = {};
  const cp = new CP();
  const flist =  [];
  for (var i =0; i < list.length; i++) {    
    _f['s_' + i] = ((i) => {
      return (cbk) => {
        let dirn = env.dataFolder + '/sites/' + list[i] + '/data/commCron/';
        fs.readdir(dirn, (err1, files) => {
          if (!err1) {
            for (let o in files)  flist.push({server:list[i], file:files[o]});
          }
          cbk(true);
        });
      }
    })(i);

  }
  cp.serial(_f, (data) => {
    if (flist.length) {
      const mserver = new MServer(env);
      mserver.onDemand(flist[0].server, flist[0].file, (data) => {
        console.log('Done !');
      });
    } else {
      const mserver = new MServer(env);
      mserver.auditOndemand();
    }
  }, 3000);
});
