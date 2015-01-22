var Doctors = require('../models/doctor.js');

module.exports.getAll = function (req, res) {
    console.log("Getting all doctors from db.");

    Doctors.find({}, function (err, documents) {
        if(err !== null){
            console.log("Failed to get all doctors ", err);
        }
        res.send(documents);
    });
}

module.exports.getOne = function (req, res) {
    console.log("Getting one doctor from db.");
    var searchParameter = decodeURI(req.url.substr(req.url.lastIndexOf('/') + 1));
    console.log("Search Parameter: " + searchParameter);

    Doctors.findOne({"_id":searchParameter}, function (err, document) {
        if(err !== null){
            console.log("Failed to get one doctor ", err);
        }
        if(document === null){
            console.log("No document matched the search parameter");
        }

        res.send(document);
    });
}

module.exports.getMatching = function (req, res) {
    console.log("Getting one doctor from db.");
    var searchParameter = req.url.substr(req.url.lastIndexOf('/') + 1);
    console.log("Search Parameter: " + searchParameter);

    //Doctors.find()

    res.send({"name":"SomeDoc"});
}

module.exports.deleteOne = function (req, res) {
    console.log("Deleting one doctor from db.");
    var searchParameter = req.url.substr(req.url.lastIndexOf('/') + 1);
    console.log("Search Parameter: " + searchParameter);

    Doctors.remove({"_id": searchParameter}, function (err, document) {
        var retMessage = "Document deleted";

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
}

module.exports.updateOne = function(req, res){
    console.log("Updating one doctor in db. ", req.body);
    var retMessage = "Document Updated";

    var doctorToSave = req.body;
    var query = {"_id": doctorToSave._id};

    Doctors.update(query, doctorToSave, function (err, numberAffected) {
        if(err !== null){
            console.log("Failed to delete one doctor ", err);
            retMessage = "Error, deleting document:" + err.message;
        }
        console.log('Affected doctors in Update: ' + numberAffected);

        res.send({"status":retMessage});
    });
}

module.exports.createOne = function(req, res){
    console.log("Creating one doctor in db. ", req.body);
    var retMessage = "Document Created";
    var newDoctor = new Doctors(req.body);

    newDoctor.save(function (err, result) {
        if(err !== null){
            console.log("Failed to create one doctor ", err);
            retMessage = "Error, creating document:" + err.message;
        }
        console.log('Affected doctors in Create: ' + result);

        res.send({"status":retMessage});
    });
}
