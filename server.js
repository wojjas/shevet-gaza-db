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
http.createServer(app).listen(3000, function () {
    console.log("Server listening on port: 3000");
});
if(ssl && ssl.options.areCertFilesRead()){
    ssl.https.createServer(ssl.options, app).listen(3001, function () {
        console.log("Server listening on port: 3001 (for https requests)");
    });
}else{
    console.log("https is not available");
}

