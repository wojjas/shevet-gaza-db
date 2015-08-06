
var authCtrl = require('../controllers/authCtrl')();
var contactsCtrl = require('../controllers/crudCtrl')('contact');
var doctorsCtrl = require('../controllers/crudCtrl')('doctor');
var patientsCtrl = require('../controllers/crudCtrl')('patient');
var usersCtrl = require('../controllers/crudCtrl')('user');
var loginCtrl = require('../controllers/loginCtrl')();
var pjson = require('../../package.json');
var db = require('../controllers/databaseCtrl.js')();

(function () {
    'use strict';

    module.exports = function(app){
        var module = {};

        app.get('/api/login', authCtrl.isAuthenticated, loginCtrl.getLogin);
        app.post('/api/login', loginCtrl.postLogin);

        app.get('/api/contacts', authCtrl.isTokenValid,contactsCtrl.getAll);
        app.get('/api/contacts/:id', authCtrl.isTokenValid, contactsCtrl.getOne);
        app.delete('/api/contacts/:id', authCtrl.isTokenValid, contactsCtrl.deleteOne);
        app.post('/api/contacts/', authCtrl.isTokenValid, contactsCtrl.createOne);
        app.put('/api/contacts/', authCtrl.isTokenValid, contactsCtrl.updateOne);

        app.get('/api/doctors', authCtrl.isTokenValid, doctorsCtrl.getAll);
        app.get('/api/doctors/:id', authCtrl.isTokenValid, doctorsCtrl.getOne);
        app.delete('/api/doctors/:id', authCtrl.isTokenValid, doctorsCtrl.deleteOne);
        app.post('/api/doctors/', authCtrl.isTokenValid, doctorsCtrl.createOne);
        app.put('/api/doctors/', authCtrl.isTokenValid, doctorsCtrl.updateOne);

        app.get('/api/patients', authCtrl.isTokenValid, patientsCtrl.getAll);
        app.get('/api/patients/:id', authCtrl.isTokenValid, patientsCtrl.getOne);
        app.delete('/api/patients/:id', authCtrl.isTokenValid, patientsCtrl.deleteOne);
        app.post('/api/patients/', authCtrl.isTokenValid, patientsCtrl.createOne);
        app.put('/api/patients/', authCtrl.isTokenValid, patientsCtrl.updateOne);

        app.post('/api/users/', authCtrl.isAuthenticated, usersCtrl.createOne);

        //For debugging:
        app.get('/ping/', function(req, res){
            var timeStamp = new Date().toISOString();
            res.status(200).send('pong at: ' + timeStamp);
        });
        app.get('/info/', function(req, res){

            var resObj = {
                version : pjson.version,
                databaseIsConnected: db.isConnected(),
                dbConnectionString: db.dbConnectionString
            };

            res.status(200).send(resObj);
        });

        return module;
    };

})();
