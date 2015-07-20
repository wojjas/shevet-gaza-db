var express = require('express');
var http = require('http');

var app = express();

//Config:
require('./server/configuration/express')(app);
require('./server/configuration/body-parser')(app);
var ssl = require('./server/configuration/ssl')();

//Database:
require('./server/controllers/databaseCtrl.js')().connect();

//Routes, REST API:
require('./server/configuration/api-routes.js')(app);

//Server:
http.createServer(app).listen(3000, function () {
    console.log("Server listening on port: 3000");
});
if(ssl.options.areCertFilesRead()){
    ssl.https.createServer(ssl.options, app).listen(3001, function () {
        console.log("Server listening on port: 3001 (for https requests)");
    });
}else{
    console.log("Failed to read certificate files, https is not available");
}

