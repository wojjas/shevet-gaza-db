var express = require('express');
var passport = require('passport');

module.exports = function(app){
    app.use(passport.initialize());
    app.use(express.static(__dirname + '/../../bower_components'));
    app.use('/js', express.static(__dirname + '/../../client/js'));
    app.use('/client', express.static(__dirname + '/../../client'));
    ////TODO: remove unused:
    app.use('/img', express.static(__dirname + '/../../client/img'));
    app.use('/', express.static(__dirname + '/../../client/'));
}