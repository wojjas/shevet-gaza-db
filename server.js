var express = require('express');
var http = require('http');

console.log("*** Starting server in " + (process.env.IN_PRODUCTION_MODE ? 'PRODUCTION' : 'DEBUG') + ' mode');

var app = express();

//Config:
require('./server/configuration/express')(app);
require('./server/configuration/body-parser')(app);

//If flag undefined, use ssl, if defined use its value
if(process.env.USE_SSL === undefined || process.env.USE_SSL){
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
    var sslPort = process.env.PORT || 3001;
    ssl.https.createServer(ssl.options, app).listen(sslPort, function () {
        console.log("Server listening on port: %s (for https requests)", sslPort);
    });
}else{
    console.log("https is not available");
}

