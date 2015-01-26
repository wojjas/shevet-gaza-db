var Doctors = require('../models/doctor.js');

// There is a configurable delay in each server-response.
// Use it for debug-purposes. Set min and max to 0 to disable it.
const MIN_DELAY = 1500;
const MAX_DELAY = 3000;
function generateRandomDelay(){
    return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

module.exports.getAll = function (req, res) {
    //TODO: implement a  var retMessage = "OK"; to be consistent with the other responses
    var delay = generateRandomDelay();
    console.log("Getting all doctors from db. Delay: " +delay + "ms");

    setTimeout(function(){
        Doctors.find({}, function (err, documents) {
            if(err !== null){
                console.log("Failed to get all doctors ", err);
            }
            res.send(documents);
        });
    }, delay)
}

module.exports.getOne = function (req, res) {
    //TODO: implement a  var retMessage = "OK"; to be consistent with the other responses
    var delay = generateRandomDelay();
    console.log("Getting one doctor from db. Delay: " +delay+ "ms");
    var searchParameter = decodeURI(req.url.substr(req.url.lastIndexOf('/') + 1));
    console.log("Search Parameter: " + searchParameter);

    setTimeout(function () {
        Doctors.findOne({"_id":searchParameter}, function (err, document) {
            if(err !== null){
                console.log("Failed to get one doctor ", err);
            }
            if(document === null){
                console.log("No document matched the search parameter");
            }

            res.send(document);
        });
    }, delay);
}

module.exports.getMatching = function (req, res) {
    console.log("Getting one doctor from db.");
    var searchParameter = req.url.substr(req.url.lastIndexOf('/') + 1);
    console.log("Search Parameter: " + searchParameter);

    //Doctors.find()

    res.send({"name":"SomeDoc"});
}

module.exports.deleteOne = function (req, res) {
    var delay = generateRandomDelay();
    console.log("Deleting one doctor from db. Delay: " +delay+ "ms");
    var searchParameter = req.url.substr(req.url.lastIndexOf('/') + 1);
    console.log("Search Parameter: " + searchParameter);

    setTimeout(function () {
            Doctors.remove({"_id": searchParameter}, function (err, document) {
            var retMessage = "OK";

            if(err !== null){
                console.log("Failed to delete one doctor ", err);
                retMessage = "Error, deleting document:" + err.message;
            }
            else if(document === null){
                console.log("No document matched the search parameter");
                retMessage = "Error, deleting document (not found)";
            }

            res.send({"status":retMessage});
        });
    }, delay);

}

module.exports.updateOne = function(req, res){
    var delay = generateRandomDelay();
    console.log("Updating one doctor in db. Delay: " +delay+ "ms");

    var retMessage = "OK";

    var doctorToSave = req.body;
    var query = {"_id": doctorToSave._id};

    setTimeout(function () {
        Doctors.update(query, doctorToSave, function (err, numberAffected) {
            if(err !== null){
                console.log("Failed to update one doctor ", err);
                retMessage = "Error, updating document:" + err.message;
            }
            console.log('Affected doctors in Update: ' + numberAffected);

            res.send({"status":retMessage});
        });
    }, delay);
}

module.exports.createOne = function(req, res){
    var delay = generateRandomDelay();
    console.log("Creating one doctor in db. Delay: " +delay+ "ms");

    var retMessage = "OK";
    var newDoctor = new Doctors(req.body);

    setTimeout(function () {
        newDoctor.save(function (err, result) {
            if(err !== null){
                console.log("Failed to create one doctor ", err);
                retMessage = "Error, creating document:" + err.message;
            }
            console.log('Affected doctors in Create: ' + result);

            res.send({"status":retMessage, "_id":result._id});
        });
    }, delay);
}
