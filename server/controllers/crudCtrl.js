var mongoose = require('mongoose');

module.exports = function(model){
    var modelDefinitionFile = '../models/' + model + '.js';
    var Model = require(modelDefinitionFile);
    var ContactModel = (model === 'patient') && require('../models/contact.js');
    var DoctorModel = (model === 'patient') && require('../models/doctor.js');

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
        console.log("Getting all %s documents from db. Delay: " +delay + "ms", model);

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
        console.log("Getting one %s document from db. Delay: " +delay+ "ms", model);
        var searchParameter = req.params.id;
        console.log("Search Parameter: " + searchParameter);

        setTimeout(function () {
            Model.findOne({"_id":searchParameter}, function (err, document) {
                err && console.log("Failed to get one document ", err);
                document == null &&  console.log("No document matched the search parameter");

                //Get all doctors and populate with related-contacts if patient:
                if(model === 'patient'){
                    DoctorModel.find({}, function(err, documents){
                        err && console.log('Failed to get all doctors when getting Patient: ' + err);
                        document._doc.doctors = documents;

                        documents.forEach(function(element, index, array){
                            document._doc.doctors[index] = element.name;
                        });

                        Model.populate(document, {path:'relatedContacts.contact'}, function(err, document) {
                            err && console.log('Failed to populate Patient with related contacts: ' + err);
                            //Check if each relation has a contact-object that is not null,
                            //(if it is it indicates failure of finding Contact)
                            var nofRelatedContacts = document._doc.relatedContacts.length;
                            for(var i = 0; i < nofRelatedContacts; i++){
                                if(!document._doc.relatedContacts[i].contact){
                                    console.log('Failed to populate Patient with related contact: %s.',
                                        document._doc.relatedContacts[i].relation);
                                }
                            }
                            res.status(200).send(document);
                        });
                    });
                }
                //Remove password, don't send it to client, if user
                else if(model === 'user') {
                    delete document.password;
                    res.status(200).send(document);
                }
                else{
                    res.status(200).send(document);
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
        console.log("Deleting one %s document from db. Delay: " +delay+ "ms", model);
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
        console.log("Updating one %s document in db. Delay: " +delay+ "ms", model);

        var retMessage = "OK";

        var documentToSave = req.body;
        var query = {"_id": documentToSave._id};
        var modifiedOn = new Date();
        var modifiedBy = req.user.username || '<unknown>';

        documentToSave.modifiedOn = modifiedOn;
        documentToSave.modifiedBy = modifiedBy;

        setTimeout(function () {
            //Handle related Contact(s) before updating Patient:
            if(model === 'patient'){
                for(var i = 0, len = documentToSave.relatedContacts.length; i < len; i++){
                    //NOTE: update is async so the Contact-documents will get updated after Patient gets updated
                    //If this becomes a problem see: http://metaduck.com/01-asynchronous-iteration-patterns.html
                    var relatedContactId = documentToSave.relatedContacts[i].contact._id;
                    documentToSave.relatedContacts[i].contact.modifiedOn = modifiedOn;
                    documentToSave.relatedContacts[i].contact.modifiedBy = modifiedBy;

                    ContactModel.update({"_id": relatedContactId}, documentToSave.relatedContacts[i].contact, function(err, numberAffected){
                        (err || numberAffected === 0) && console.log('Failed to update related contact');
                    });
                    documentToSave.relatedContacts[i].contact = relatedContactId;
                }
                //No need to save the list of doctor names (It's a HACK that it exists in the first place)
                if(documentToSave.doctors && documentToSave.doctors.length > 0){
                    delete documentToSave.doctors;
                }
            }
            if(model === 'user'){
                //TODO: fix this so that passwords get hashed upon update as well! (in user.js call: userShema.pre('update', ...))
                console.log('Updating user will not hash its password, use save instead!');
                res.status(500).send({"status":'Failed to update user. Use save, not update, when updating users'});

                return;
            }

            Model.update(query, documentToSave, function (err, numberAffected) {
                console.log('Affected documents in Update: ' + numberAffected);

                if(err){
                    console.log("Failed to update one document ", err);
                    retMessage = "Error, updating document:" + err.message;

                    res.status(500).send({"status":retMessage});
                }else{
                    res.status(200).send({"status":retMessage});
                }
            });
        }, delay);
    };

    module.createOne = function(req, res){
        var delay = generateRandomDelay();
        console.log("Creating one document in db. Delay: " +delay+ "ms");
        console.log("Incomming req.body: ", req.body);

        var retMessage = "OK";
        var newDocument = new Model(req.body);
        newDocument.modifiedBy = req.user.username || '<unknown>';

        setTimeout(function () {
            newDocument.save(function (err, result) {
                if(err !== null){
                    console.log("Failed to create one document ", err);
                    retMessage = err.code === 11000 ? "Error, document already exists" : ("Error, creating document: " + err.message);
                }
                console.log('Affected documents in Create: ' + result);

                res.send({"status":retMessage, "_id": (result ? result._id : '')});
            });
        }, delay);
    };

    return module;
};

