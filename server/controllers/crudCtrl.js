var mongoose = require('mongoose');

module.exports = function(model){
    var modelDefinitionFile = '../models/' + model + '.js';
    var Model = require(modelDefinitionFile);

// There is a configurable delay in each server-response.
// Use it for debug-purposes. Set min and max to 0 to disable it.
    const MIN_DELAY = 0;
    const MAX_DELAY = 0;
    function generateRandomDelay(){
        return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
    }

    var module = {};

    module.getAll = function (req, res) {
        var delay = generateRandomDelay();
        console.log("Getting all documents from db. Delay: " +delay + "ms");

        setTimeout(function(){
            Model.find({}, function (err, documents) {
                if(err !== null){
                    console.log("Failed to get all documents ", err);
                }
                res.send(documents);
            });
        }, delay)
    };

    module.getOne = function (req, res) {
        var delay = generateRandomDelay();
        console.log("Getting one document from db. Delay: " +delay+ "ms");
        var searchParameter = req.params.id;
        console.log("Search Parameter: " + searchParameter);

        setTimeout(function () {
            Model.findOne({"_id":searchParameter}, function (err, document) {
                err && console.log("Failed to get one document ", err);
                document == null &&  console.log("No document matched the search parameter");

                //Populate with related-contacts if patient
                if(model === 'patient'){
                    Model.populate(document, {path:'relatedContacts.contact'}, function(err, document) {
                        err && console.log('Failed to populate Patient with related contacts: ' + err);
                        //TODO: check if each relation has a contact-object that is not null,
                        // (if it is it indicates failure of finding Contact)
                        var nofRelatedContacts = document._doc.relatedContacts.length;
                        for(var i = 0; i < nofRelatedContacts; i++){
                            if(!document._doc.relatedContacts[i].contact){
                                console.log('Failed to populate Patient with related contact: %s.',
                                             document._doc.relatedContacts[i].relation);
                            }
                        }
                        res.send(document);
                    });
                }else{
                    res.send(document);
                }
            });
        }, delay);
    };

    module.getMatching = function (req, res) {
        console.log("Getting one document from db.");
        var searchParameter = req.params.id;
        console.log("Search Parameter: " + searchParameter);

        //Model.find()

        res.send({"name":"SomeDoc"});
    };

    module.deleteOne = function (req, res) {
        var delay = generateRandomDelay();
        console.log("Deleting one document from db. Delay: " +delay+ "ms");
        var searchParameter = req.params.id;
        console.log("Search Parameter: " + searchParameter);

        setTimeout(function () {
            Model.remove({"_id": searchParameter}, function (err, document) {
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
            Model.update(query, documentToSave, function (err, numberAffected) {
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
        var newDocument = new Model(req.body);

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

    return module;
};

