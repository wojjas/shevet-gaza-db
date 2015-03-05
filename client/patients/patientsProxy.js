/*
* Patient service, communicates with server to perform CRUD on patients collection.
* Saves gotten patient or patients in local storage.
* Saves/gets selectedPatient in/from local storage for communication between controllers.
* */
(function () {
    'use strict';

    angular
        .module('gdPatients')
        .factory('patientsProxy', ['$resource', 'config', patients]);

    //Performs CRUD against LocalStorage and, or remote db.
    //Every document stored in LocalStorage is assigned an unique string with known prefix as _id.
    //This is needed to be able to CRUD it against LocalStorage.
    //Upon each save, if this tmp-id is exists it is removed so that the remote db
    //can assign an _id to this document. Upon successful save this _id is assigned to the
    //document in LocalStorage so that remote and local data is in sync.
    function patients($resource, config) {
        var Patient = {};          /*Main resource*/
        var tmpLocalIdPrefix = '-';

        var service = {
            createNewPatient: createNewPatient,
            //Server communication: CRUD
            readAllPatients: readAllPatients,
            readOnePatient: readOnePatient,
            deletePatient: deletePatient,
            createPatient: createPatient,
            updatePatient: updatePatient
        };

        init();

        return service;

        ////////////////

        function init(){
            Patient = $resource('/api/patients/:_id', {id:'@_id'}, {update: {method: 'PUT'}});
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


        function createNewPatient(){
            return $resource('/api/patients/:_id', {id:'@_id'});
        }

        function readAllPatients(){
            if(config.getOfflineMode()){
                console.log('client requests all patients from LocalStorage');
                if(window.localStorage['patients']){
                    return JSON.parse(window.localStorage['patients']);
                }
                return [];
            }else{
                console.log('client requests all patients from Server');
                return Patient.query(function (response) {
                    window.localStorage['patients'] = JSON.stringify(response.data);
                }, function (error) {
                    console.debug("Error getting patients: ", error);
                });
            }
        }

        function readOnePatient(searchParameter) {
            if(config.getOfflineMode()){
                console.log("client requests one patient from LocalStorage, with parameter: " + searchParameter);
                var patients = JSON.parse(window.localStorage['patients']);

                for(var i = 0, len = patients.length; i<len; i++){
                    if(patients[i]._id === searchParameter){
                        return patients[i];
                    }
                }
                console.debug('Error, did not find requested patient in local storage, nof patients in local storage: ' + len);
                return {};
            }else{
                console.log("client requests one patient from Server, with parameter: " + searchParameter);

                return Patient.get({"_id":searchParameter}, function (response) {
                    window.localStorage['patient'] = JSON.stringify(response);
                }, function (error) {
                    console.debug("Error getting patient: ", error);
                });
            }
        }

        function deletePatient(searchParameter){
            if(config.getOfflineMode()){
                console.log('client requests to delete one patient from LocalStorage');
                var patients = JSON.parse(window.localStorage['patients']);

                for(var i = 0, len = patients.length; i<len; i++){
                    if(patients[i]._id === searchParameter){
                        patients.splice(i, 1);
                        window.localStorage['patients'] = JSON.stringify(patients);

                        return {};
                    }
                }
            }else{
                console.log('client requests to delete one patient from Server');
                return Patient.delete({"_id":searchParameter}, function (response) {
                    if(response.status !== "OK"){
                        console.debug('Failed to delete document: ' + response.status);
                    }
                });
            }
        }

        function createPatient(patient){
            if(config.getOfflineMode()){
                var patients = JSON.parse(window.localStorage['patients']);
                patient._id = createTmpLocalId();
                patients.push(patient);
                window.localStorage['patients'] = JSON.stringify(patients);

                return {};
            }else{
                //Locally stored documents are assigned temp ids. If this document is a locally stored one
                //remove the id-property to let the remote db assign a new one upon creation/save.
                if(patient._id && documentHasTmpLocalId(patient)){
                    delete patient._id;
                }

                return Patient.save(patient, function (response) {
                    if(response.status !== "OK"){
                        console.debug('Failed to save document: ' + response.status);

                        return;
                    }
                    patient._id = response._id;
                });
            }
        }
        function updatePatient(patient){
            if(config.getOfflineMode()){
                console.log('client requests to update one patient on LocalStorage');
                var patients = JSON.parse(window.localStorage['patients']);

                for(var i = 0, len = patients.length; i<len; i++){
                    if(patients[i]._id === patient._id){
                        patients[i] = patient;
                        window.localStorage['patients'] = JSON.stringify(patients);

                        return {};
                    }
                }
                console.debug('Failed to update patient in LocalStorage: Could not find it');
            }else{
                //Locally stored documents are assigned negative ids.
                //This will not be an update but an create if id is tmpLocalId.
                //Remove the id-property to let the server db assign a new one upon creation/save.
                if(patient._id && documentHasTmpLocalId(patient)){
                    delete patient._id;

                    return Patient.save(patient, function (response) {
                        if(response.status !== "OK"){
                            console.debug('Failed to update document: ' + response.status);

                            return;
                        }
                        console.log('Upserted patient: ', response._id);

                        patient._id = response._id;
                    });
                }else{
                    return Patient.update(patient, function (response) {
                        if(response.status !== "OK"){
                            console.debug('Failed to update document: ' + response.status);

                            return;
                        }
                        console.log('Affected patients in Update: ', response._id);
                    });
                }
            }
        }
    }
})();