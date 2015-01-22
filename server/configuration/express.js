var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app){
    app.use(express.static(__dirname + '/../../bower_components'));
    app.use('/js', express.static(__dirname + '/../../client/js'));
    app.use('/client', express.static(__dirname + '/../../client'));
    //TODO: remove unused:
    app.use('/partials', express.static(__dirname + '/../../client/partials'));
    app.use('/img', express.static(__dirname + '/../../client/img'));
    app.use('/', express.static(__dirname + '/../../client/'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
}