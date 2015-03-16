/*
* Contact service, communicates with server to perform CRUD on contacts collection.
* Saves gotten contact or contacts in local storage.
* Saves/gets selectedContact in/from local storage for communication between controllers.
* */
(function () {
    'use strict';

    angular
        .module('gdContacts')
        .factory('contactsProxy', ['$resource', 'config', contacts]);

    //Performs CRUD against LocalStorage and, or remote db.
    //Every document stored in LocalStorage is assigned an unique string with known prefix as _id.
    //This is needed to be able to CRUD it against LocalStorage.
    //Upon each save, if this tmp-id is exists it is removed so that the remote db
    //can assign an _id to this document. Upon successful save this _id is assigned to the
    //document in LocalStorage so that remote and local data is in sync.
    function contacts($resource, config) {
        var Contact = {};          /*Main resource*/
        var tmpLocalIdPrefix = '-';

        var service = {
            createNewContact: createNewContact,
            //Server communication: CRUD
            readAllContacts: readAllContacts,
            readOneContact: readOneContact,
            deleteContact: deleteContact,
            createContact: createContact,
            updateContact: updateContact
        };

        init();

        return service;

        ////////////////

        function init(){
            Contact = $resource('/api/contacts/:_id', {id:'@_id'}, {update: {method: 'PUT'}});
        }

        function documentHasTmpLocalId(document){
            if(!document._id){
                console.debug('Document has no _id. This should never be the case.');
                return false;
            }

            return document._id.slice(0, tmpLocalIdPrefix.length) === tmpLocalIdPrefix
        }
        //Creates a temporary id for a locally stored document.
        function createTmpLocalId(){
            return tmpLocalIdPrefix + new Date().getTime();
        }


        function createNewContact(){
            return $resource('/api/contacts/:_id', {id:'@_id'});
        }

        function readAllContacts(){
            if(config.getOfflineMode()){
                console.log('client requests all contacts from LocalStorage');
                if(window.localStorage['contacts']){
                    return JSON.parse(window.localStorage['contacts']);
                }
                return [];
            }else{
                console.log('client requests all contacts from Server');
                return Contact.query(function (response) {
                    window.localStorage['contacts'] = JSON.stringify(response.data);
                }, function (error) {
                    console.debug("Error getting contacts: ", error);
                });
            }
        }

        function readOneContact(searchParameter) {
            if(config.getOfflineMode()){
                console.log("client requests one contact from LocalStorage, with parameter: " + searchParameter);
                var contacts = JSON.parse(window.localStorage['contacts']);

                for(var i = 0, len = contacts.length; i<len; i++){
                    if(contacts[i]._id === searchParameter){
                        return contacts[i];
                    }
                }
                console.debug('Error, did not find requested contact in local storage, nof contacts in local storage: ' + len);
                return {};
            }else{
                console.log("client requests one contact from Server, with parameter: " + searchParameter);

                return Contact.get({"_id":searchParameter}, function (response) {
                    window.localStorage['contact'] = JSON.stringify(response);
                }, function (error) {
                    console.debug("Error getting contact: ", error);
                });
            }
        }

        function deleteContact(searchParameter){
            if(config.getOfflineMode()){
                console.log('client requests to delete one contact from LocalStorage');
                var contacts = JSON.parse(window.localStorage['contacts']);

                for(var i = 0, len = contacts.length; i<len; i++){
                    if(contacts[i]._id === searchParameter){
                        contacts.splice(i, 1);
                        window.localStorage['contacts'] = JSON.stringify(contacts);

                        return {};
                    }
                }
            }else{
                console.log('client requests to delete one contact from Server');
                return Contact.delete({"_id":searchParameter}, function (response) {
                    if(response.status !== "OK"){
                        console.debug('Failed to delete document: ' + response.status);
                    }
                });
            }
        }

        function createContact(contact){
            if(config.getOfflineMode()){
                var contacts = JSON.parse(window.localStorage['contacts']);
                contact._id = createTmpLocalId();
                contacts.push(contact);
                window.localStorage['contacts'] = JSON.stringify(contacts);

                return {};
            }else{
                //Locally stored documents are assigned temp ids. If this document is a locally stored one
                //remove the id-property to let the remote db assign a new one upon creation/save.
                if(contact._id && documentHasTmpLocalId(contact)){
                    delete contact._id;
                }

                return Contact.save(contact, function (response) {
                    if(response.status !== "OK"){
                        console.debug('Failed to save document: ' + response.status);

                        return;
                    }
                    contact._id = response._id;
                });
            }
        }
        function updateContact(contact){
            if(config.getOfflineMode()){
                console.log('client requests to update one contact on LocalStorage');
                var contacts = JSON.parse(window.localStorage['contacts']);

                for(var i = 0, len = contacts.length; i<len; i++){
                    if(contacts[i]._id === contact._id){
                        contacts[i] = contact;
                        window.localStorage['contacts'] = JSON.stringify(contacts);

                        return {};
                    }
                }
                console.debug('Failed to update contact in LocalStorage: Could not find it');
            }else{
                //Locally stored documents are assigned negative ids.
                //This will not be an update but an create if id is tmpLocalId.
                //Remove the id-property to let the server db assign a new one upon creation/save.
                if(contact._id && documentHasTmpLocalId(contact)){
                    delete contact._id;

                    return Contact.save(contact, function (response) {
                        if(response.status !== "OK"){
                            console.debug('Failed to update document: ' + response.status);

                            return;
                        }
                        console.log('Upserted contact: ', response._id);

                        contact._id = response._id;
                    });
                }else{
                    return Contact.update(contact, function (response) {
                        if(response.status !== "OK"){
                            console.debug('Failed to update document: ' + response.status);

                            return;
                        }
                        console.log('Affected contacts in Update: ', response._id);
                    });
                }
            }
        }
    }
})();