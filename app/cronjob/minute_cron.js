const env = {
        root : __dirname,
        dataFolder : '/var/_localAppData',
        appFolder : '/var/_localApp'
      },
      
      fs = require('fs'),
      CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js');

delete require.cache[__dirname + '/modules/moduleServer.js'];
const MServer = require(__dirname + '/modules/moduleServer.js');

fs.readdir(env.dataFolder + '/sites', (err, list) => {
  const _f = {};
  for (var i =0; i < list.length; i++) {
    _f['s_' + i] = ((i) => {
      return (cbk) => {
        let dirn = env.dataFolder + '/sites/' + list[i] + '/data/commCron/';
        fs.readdir(dirn, (err1, files) => {
          if (!err1) {
            for (var j = 0; j < files.length; j++) {
              var mserver = new MServer(env);
              mserver.onDemand(list[i], dirn + files[j], (data) => {
                cbk(data);
              });
            }
          }  else {
            cbk(false);
          }
        });
      }
    })(i);
  }
  const cp = new CP();
  cp.serial(_f, (data) => {
    // console.log(data);
  }, 3000);
});
