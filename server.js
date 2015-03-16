var express = require('express');
var mongoose = require('mongoose');

var contactsCtrl = require('./server/controllers/crudCtrl')('contact');
var doctorsCtrl = require('./server/controllers/crudCtrl')('doctor');
var patientsCtrl = require('./server/controllers/crudCtrl')('patient');

var app = express();

//Config:
require('./server/configuration/express')(app);

//Database:
var dbConnectionString = 'mongodb://localhost:27037/gaza'
mongoose.connect(dbConnectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));
db.once('open', function () {
    console.log('Opened db connection to: ' + dbConnectionString);
})

//Routes:
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/partials/home.html');
});
//REST API:
app.get('/api/contacts', contactsCtrl.getAll);      //this is for the Contacts.query(...
app.get('/api/contacts/:id', contactsCtrl.getOne);
app.delete('/api/contacts/:id', contactsCtrl.deleteOne);
app.post('/api/contacts/', contactsCtrl.createOne);
app.put('/api/contacts/', contactsCtrl.updateOne);

app.get('/api/doctors', doctorsCtrl.getAll);      //this is for the Doctors.query(...
app.get('/api/doctors/:id', doctorsCtrl.getOne);
app.delete('/api/doctors/:id', doctorsCtrl.deleteOne);
app.post('/api/doctors/', doctorsCtrl.createOne);
app.put('/api/doctors/', doctorsCtrl.updateOne);

app.get('/api/patients', patientsCtrl.getAll);
app.get('/api/patients/:id', patientsCtrl.getOne);
app.delete('/api/patients/:id', patientsCtrl.deleteOne);
app.post('/api/patients/', patientsCtrl.createOne);
app.put('/api/patients/', patientsCtrl.updateOne);

//Server:
app.listen(3000, function () {
    console.log("Server listening on port: 3000");
})
