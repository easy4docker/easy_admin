const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var path = require('path');

const port = 80;
var env = {
    root : __dirname,
    dataFolder : '/var/_localAppData',
    appFolder : '/var/_localApp'
}
var pkg = {
    require : function(fileName, isCache) {
        if (!isCache) {
            delete require.cache[fileName];
        }
        return require(fileName);
    },
    // md5 : require('md5'),
    crowdProcess : require(__dirname + '/vendor/crowdProcess/crowdProcess.js'),
    ECT : require('ect')
}
app.engine('ect', pkg.ECT({ watch: true, cache: false, root: __dirname + '/views', ext : '.ect' }).render);

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
    const fs = require('fs');
    fs.writeFile(env.dataFolder + '/_log/admin.log', 'Start easy admin at http://localhost:' + port,  {'flag':'a'},  function(err) {
        if (err) {
            return console.error(err);
        }
    });
    console.log(`Easy admin listening at http://localhost:${port}`);
});
