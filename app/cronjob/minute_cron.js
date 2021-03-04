const env = {
        root : __dirname,
        dataFolder  : '/var/_localAppData',
        appFolder   : '/var/_localApp',
        keyFolder   : '/var/_localAppKey',
        shareFolder : '/var/_localAppData/sitesShareFolder'
      },
      fs = require('fs'),
      CP = require(env.appFolder + '/vendor/crowdProcess/crowdProcess.js');

  var localConfig = {};
  try {
    localConfig = require(env.data_dir + '/_env.json');
  } catch (e) {}

env.localConfig = JSON.stringify(localConfig);

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
      doUpload();
    }
  }, 3000);
});
var doUpload = () => {
  

  fs.readdir(env.shareFolder, (err, list) => {
    const _f = {};
    const cp = new CP();
    const flist =  [];

    for (var i =0; i < list.length; i++) {
      let dirn = env.shareFolder+ '/' + list[i];
      _f['s_' + i] = ((i) => {
        return (cbk) => {
          fs.readdir(dirn, (err1, list1) => {
            if (!err1) {
              const cp1 = new CP();
              const _f1 = {};
              for (let j =0; j < list1.length; j++) {
                let dirn1 = dirn+ '/' + list1[j];
               
                _f1['s_' + j] = ((j) => {
                  return (cbk1) => {
                    fs.readdir(dirn1, (err2, list2) => {
                      if (!err2) {
                        if (list2.indexOf('ondemand_finished.data') !== -1) {
                          flist.push({dir:dirn, folder:list1[j]})
                        }
                      }
                      cbk1(true);
                    })
                  }
                })(j);
              }
              cp1.serial(_f1, (data) => {
                cbk(true);
              }, 3000);
            } else {
              cbk(true);
            }
          });
        }
      })(i)
    }
    cp.serial(_f, (data) => {
      if (flist.length) {
        const mserver = new MServer(env);
        mserver.uploadFolder(flist[0]);
      } else {
        const mserver = new MServer(env);
       // mserver.auditOndemand();
      }
    }, 3000);
  });
}