var express = require('express');
var mongoose = require('mongoose');

var doctorsCtrl = require('./server/controllers/doctorsCtrl');

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
app.get('/api/doctors', doctorsCtrl.getAll);      //this is for the Doctors.query(...
app.get('/api/doctors/:id', doctorsCtrl.getOne);
app.delete('/api/doctors/:id', doctorsCtrl.deleteOne);
app.post('/api/doctors/', doctorsCtrl.createOne);
app.put('/api/doctors/', doctorsCtrl.updateOne);

//Server:
app.listen(3000, function () {
    console.log("Server listening on port: 3000");
})
