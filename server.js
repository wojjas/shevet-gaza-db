var express = require('express');
var http = require('http');

console.log("*** Starting server in " + (process.env.ENV_PRODUCTION ? 'PRODUCTION' : 'DEBUG') + ' mode');

var app = express();

//Config:
require('./server/configuration/express')(app);
require('./server/configuration/body-parser')(app);

if(process.env.ENV_PRODUCTION){
    var ssl = require('./server/configuration/ssl')();
}

//Database:
require('./server/controllers/databaseCtrl.js')().connect();

//Routes, REST API:
require('./server/configuration/api-routes.js')(app);

//Server:
var port = process.env.PORT || 3000;
http.createServer(app).listen(port, function () {
    console.log("Server listening on port: " + port);
});
if(ssl && ssl.options.areCertFilesRead()){
    port = process.env.PORT || 3001;
    ssl.https.createServer(ssl.options, app).listen(port, function () {
        console.log("Server listening on port: %s (for https requests)", port);
    });
}else{
    console.log("https is not available");
}

