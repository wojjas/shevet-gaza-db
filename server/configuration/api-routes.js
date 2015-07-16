
var authCtrl = require('../controllers/authCtrl')();
var contactsCtrl = require('../controllers/crudCtrl')('contact');
var doctorsCtrl = require('../controllers/crudCtrl')('doctor');
var patientsCtrl = require('../controllers/crudCtrl')('patient');
var usersCtrl = require('../controllers/crudCtrl')('user');
var loginCtrl = require('../controllers/loginCtrl')();

(function () {
    'use strict';

    module.exports = function(app){
        var module = {};

        app.get('/api/login', authCtrl.isAuthenticated, loginCtrl.getLogin);
        app.post('/api/login', loginCtrl.postLogin);

        app.get('/api/contacts', contactsCtrl.getAll);
        app.get('/api/contacts/:id', contactsCtrl.getOne);
        app.delete('/api/contacts/:id', contactsCtrl.deleteOne);
        app.post('/api/contacts/', contactsCtrl.createOne);
        app.put('/api/contacts/', contactsCtrl.updateOne);

        //TODO: protect the other rotes as well with "authCtrl.isTokenValid"

        app.get('/api/doctors', authCtrl.isTokenValid, doctorsCtrl.getAll);
        app.get('/api/doctors/:id', authCtrl.isTokenValid, doctorsCtrl.getOne);
        app.delete('/api/doctors/:id', authCtrl.isTokenValid, doctorsCtrl.deleteOne);
        app.post('/api/doctors/', authCtrl.isTokenValid, doctorsCtrl.createOne);
        app.put('/api/doctors/', authCtrl.isTokenValid, doctorsCtrl.updateOne);

        app.get('/api/patients', patientsCtrl.getAll);
        app.get('/api/patients/:id', patientsCtrl.getOne);
        app.delete('/api/patients/:id', patientsCtrl.deleteOne);
        app.post('/api/patients/', patientsCtrl.createOne);
        app.put('/api/patients/', patientsCtrl.updateOne);

        app.post('/api/users/', authCtrl.isAuthenticated, usersCtrl.createOne);

        return module;
    };

})();
