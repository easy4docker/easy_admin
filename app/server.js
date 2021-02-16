const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var fs = require('fs');

const port = 80;
var env = {
    root : __dirname,
    dataFolder : '/var/_localAppData',
    appFolder : '/var/_localApp'
}

var accessLogStream = fs.createWriteStream(path.join(env.dataFolder, 'access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}))

var pkg = {
    readJson : (path, cb) => {
        fs.readFile(path, (err, data) => {
          if (err)
            cb({})
          else
            var jdata = {};
            try {
                jdata = JSON.parse(data);
            } catch (e) {}
            cb(jdata);
        })
    },
    require : (fileName, isCache) => {
        if (!isCache) {
            delete require.cache[fileName];
        }
        return require(fileName);
    },
    md5 : require('md5'),
    crowdProcess : require(__dirname + '/vendor/crowdProcess/crowdProcess.js'),
    ECT : require('ect')
}
app.engine('ect', pkg.ECT({ watch: true, cache: false, root: __dirname + '/views', ext : '.ect' }).render);

app.use(function(err, req, res, next) {
    // Do logging and user-friendly error message display
    //console.error(err);
    // Assuming that template engine is plugged in
    res.send('500.html');
});

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies   
  extended: true
})); 

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var RESTS = 'get|put|post|delete'.split('|');

for (var i=0 ; i < RESTS.length; i++) {
    (function(i) {
        app[RESTS[i]](/(.+)$/i, (req, res) => {
            var APP = pkg.require(__dirname + '/modules/appRouter.js');
            var app = new APP(env, pkg, req, res);
            try {
                app.route(RESTS[i]);
            } catch (err) {
                res.send(err.toString());
            }
        });
    })(i)
}

app.listen(port,  () => {
    var d = new Date(); // for now
    datetext = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    console.log(datetext + ' Start Easy admin listening at http://localhost');
});
