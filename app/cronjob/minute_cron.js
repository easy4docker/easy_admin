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
    localConfig = require(env.dataFolder + '/_env.json');
  } catch (e) {}

env.localConfig = localConfig;

delete require.cache[__dirname + '/modules/moduleServer.js'];
const MServer = require(__dirname + '/modules/moduleServer.js');
const mserver = new MServer(env);

var ondemandMark = env.dataFolder + '/ondemandMark.txt';

fs.readFile(ondemandMark, 'utf-8', function(err, onDemandCode) {
  if (!err && (onDemandCode)) {
    fs.stat(env.dataFolder + '/sites/' + onDemandCode, (err, stat) => {
      if (err && err.code === 'ENOENT') {
        fs.unlink(ondemandMark, () =>{
          console.log('')
          console.log('remove ' + onDemandCode);
        });
      }
    })
    process.stdout.write(".");
  } else {
    pickOneOnDemand((onDemandCode)=> {
      if (onDemandCode) {
        fs.writeFile(ondemandMark, onDemandCode, () => {
          mserver.onDemand(onDemandCode, (data) => {
            console.log('onDemandPushed!');
          });
        })
      } else {
        mserver.completedOnDemand((data) => {
          console.log('completeOnDemand!');
        });
      }
    })
  }
});
var pickComletedOnDemand = (callback) => {
    callback();
}
var pickOneOnDemand = (callback) => {
  fs.readdir(env.dataFolder + '/sites', (err, list) => {
    const _f = {};
    const cp = new CP();
    const flist =  [];
    let onDemandCode = '';
    for (var i =0; i < list.length; i++) {   
      _f['s_' + i] = ((i) => {
        return (cbk) => {
          if  (onDemandCode) {
            cbk(true);
          } else {
            let dirn = env.dataFolder + '/sites/' + list[i] + '/data/onDemand/';
            fs.readdir(dirn, (err1, files) => {
              if (!err1 && files.length) {
                for (let j in files) {
                  if (!/^\./.test(files[j])) {
                    onDemandCode = list[i] + '/data/onDemand/' + files[j];
                    break;
                  }
                }
              }
              cbk(true);
            });
          }
        }
      })(i);
    }
    cp.serial(_f, (data) => {
      callback((onDemandCode) ? onDemandCode : '');
      // console.log('niu');
      /*
      if (flist.length) {
        const mserver = new MServer(env);
        mserver.onDemand(flist[0].server, flist[0].file, (data) => {
          console.log('Done !');
        });
      } else {
        doUpload();
      }
      */
      
    }, 3000);
  });
}

/*
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
        // const mserver = new MServer(env);
        mserver.uploadFolder(flist[0]);
      } else {
        // const mserver = new MServer(env);
        mserver.auditOndemand();
      }
    }, 3000);
  });
}
*/