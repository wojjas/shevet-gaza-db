var mongoose = require('mongoose');

module.exports = function () {
    var ContactsCollection = require('../models/contact.js');
    var PatientsCollection = require('../models/patient.js');

// There is a configurable delay in each server-response.
// Use it for debug-purposes. Set min and max to 0 to disable it.
    const MIN_DELAY = 0;
    const MAX_DELAY = 0;

    function generateRandomDelay() {
        return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
    }

    var getOnePatient = function getOnePatient(req) {
        console.log("Getting one document from db. Without delay.");
        var searchParameter = decodeURI(req.url.substr(req.url.lastIndexOf('/') + 1));
        console.log("Search Parameter: " + searchParameter);
        var id;

        try {
            var id = new mongoose.Schema.ObjectId(searchParameter);
        }catch (err){
            console.log('Failed to convert search parameter from client to a valid ObjectId'  +
                        (err.message ? '. Message: ' + err.message : ''));

            return;
        }

        PatientsCollection.findOne({"_id": id}, function (err, document) {
            if (err !== null) {
                console.log("Failed to get one document ", err);
            }
            if (document === null) {
                console.log("No document matched the search parameter");
            }

            return document;
        });
    };
    var getOneContact = function getOnePatient(searchParameter) {
        var retValue = {};
        console.log("Getting one document from db. Without delay.");
        //var searchParameter = decodeURI(req.url.substr(req.url.lastIndexOf('/') + 1));
        console.log("Search Parameter: " + searchParameter);

        ContactsCollection.findOne({"_id": searchParameter}, function (err, document) {
            if (err !== null) {
                console.log("Failed to get one document ", err);
            }
            if (document === null) {
                console.log("No document matched the search parameter");
            }

            return document;
        });
    };

    var module = {};

    module.getAll = function (req, res) {
        var delay = generateRandomDelay();
        console.log("Getting all documents from db. Delay: " + delay + "ms");
        //TODO: Delay
        var relatedContacts = [];

        var patient = getOnePatient(req);

        if(patient && patient.relatedContacts){
            for(var i = 0, len = patient.relatedContacts.length; i < len; i++){
                var contactId = patient.relatedContacts[i].id;
                var contact = getOneContact(contactId);
                relatedContacts.push(contact);
            }
        }else{
            console.log('ERROR, failed to get related contacts.');
        }

        res.send(relatedContacts);

        //setTimeout(function(){
        //    ContactsCollection.find({}, function (err, documents) {
        //        if(err !== null){
        //            console.log("Failed to get all documents ", err);
        //        }
        //        //res.send(documents);
        //    });
        //}, delay)
    };

    /*
     module.getOne = function (req, res) {
     var delay = generateRandomDelay();
     console.log("Getting one document from db. Delay: " +delay+ "ms");
     var searchParameter = decodeURI(req.url.substr(req.url.lastIndexOf('/') + 1));
     console.log("Search Parameter: " + searchParameter);

     setTimeout(function () {
     Collection.findOne({"_id":searchParameter}, function (err, document) {
     if(err !== null){
     console.log("Failed to get one document ", err);
     }
     if(document === null){
     console.log("No document matched the search parameter");
     }

     res.send(document);
     });
     }, delay);
     };

     module.getMatching = function (req, res) {
     console.log("Getting one document from db.");
     var searchParameter = req.url.substr(req.url.lastIndexOf('/') + 1);
     console.log("Search Parameter: " + searchParameter);

     //Collection.find()

     res.send({"name":"SomeDoc"});
     };

     module.deleteOne = function (req, res) {
     var delay = generateRandomDelay();
     console.log("Deleting one document from db. Delay: " +delay+ "ms");
     var searchParameter = req.url.substr(req.url.lastIndexOf('/') + 1);
     console.log("Search Parameter: " + searchParameter);

     setTimeout(function () {
     Collection.remove({"_id": searchParameter}, function (err, document) {
     var retMessage = "OK";

     if(err !== null){
     console.log("Failed to delete one document ", err);
     retMessage = "Error, deleting document:" + err.message;
     }
     else if(document === null){
     console.log("No document matched the search parameter");
     retMessage = "Error, deleting document (not found)";
     }

     res.send({"status":retMessage});
     });
     }, delay);
     };

     module.updateOne = function(req, res){
     var delay = generateRandomDelay();
     console.log("Updating one document in db. Delay: " +delay+ "ms");

     var retMessage = "OK";

     var documentToSave = req.body;
     var query = {"_id": documentToSave._id};

     setTimeout(function () {
     Collection.update(query, documentToSave, function (err, numberAffected) {
     if(err !== null){
     console.log("Failed to update one document ", err);
     retMessage = "Error, updating document:" + err.message;
     }
     console.log('Affected documents in Update: ' + numberAffected);

     res.send({"status":retMessage});
     });
     }, delay);
     };

     module.createOne = function(req, res){
     var delay = generateRandomDelay();
     console.log("Creating one document in db. Delay: " +delay+ "ms");

     var retMessage = "OK";
     var newDocument = new Collection(req.body);

     setTimeout(function () {
     newDocument.save(function (err, result) {
     if(err !== null){
     console.log("Failed to create one document ", err);
     retMessage = "Error, creating document:" + err.message;
     }
     console.log('Affected documents in Create: ' + result);

     res.send({"status":retMessage, "_id":result._id});
     });
     }, delay);
     };
     */
    return module;
};

