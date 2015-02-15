/*
* Doctor service, communicates with server to perform CRUD on doctors collection.
* Saves gotten doctor or doctors in local storage.
* Saves/gets selectedDoctor in/from local storage for communication between controllers.
* */
(function () {
    'use strict';

    angular
        .module('gdDoctors')
        .factory('doctors', ['$resource', 'config', doctors]);

    //Performs CRUD against LocalStorage and, or remote db.
    //Every document stored in LocalStorage is assigned an unique string with known prefix as _id.
    //This is needed to be able to CRUD it against LocalStorage.
    //Upon each save, if this tmp-id is exists it is removed so that the remote db
    //can assign an _id to this document. Upon successful save this _id is assigned to the
    //document in LocalStorage so that remote and local data is in sync.
    function doctors($resource, config) {
        var Doctor = {};          /*Main resource*/
        var tmpLocalIdPrefix = '-';

        var service = {
            createNewDoctor: createNewDoctor,
            //Server communication: CRUD
            readAllDoctors: readAllDoctors,
            readOneDoctor: readOneDoctor,
            deleteDoctor: deleteDoctor,
            createDoctor: createDoctor,
            updateDoctor: updateDoctor
        };

        init();

        return service;

        ////////////////

        function init(){
            Doctor = $resource('/api/doctors/:_id', {id:'@_id'}, {update: {method: 'PUT'}});
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


        function createNewDoctor(){
            return $resource('/api/doctors/:_id', {id:'@_id'});
        }

        function readAllDoctors(){
            if(config.getOfflineMode()){
                console.log('client requests all doctors from LocalStorage');
                if(window.localStorage['doctors']){
                    return JSON.parse(window.localStorage['doctors']);
                }
                return [];
            }else{
                console.log('client requests all doctors from Server');
                return Doctor.query(function (response) {
                    window.localStorage['doctors'] = JSON.stringify(response.data);
                }, function (error) {
                    console.debug("Error getting doctors: ", error);
                });
            }
        }

        function readOneDoctor(searchParameter) {
            if(config.getOfflineMode()){
                console.log("client requests one doctor from LocalStorage, with parameter: " + searchParameter);
                var doctors = JSON.parse(window.localStorage['doctors']);

                for(var i = 0, len = doctors.length; i<len; i++){
                    if(doctors[i]._id === searchParameter){
                        return doctors[i];
                    }
                }
                console.debug('Error, did not find requested doctor in local storage, nof doctors in local storage: ' + len);
                return {};
            }else{
                console.log("client requests one doctor from Server, with parameter: " + searchParameter);

                return Doctor.get({"_id":searchParameter}, function (response) {
                    window.localStorage['doctor'] = JSON.stringify(response);
                }, function (error) {
                    console.debug("Error getting doctor: ", error);
                });
            }
        }

        function deleteDoctor(searchParameter){
            if(config.getOfflineMode()){
                console.log('client requests to delete one doctor from LocalStorage');
                var doctors = JSON.parse(window.localStorage['doctors']);

                for(var i = 0, len = doctors.length; i<len; i++){
                    if(doctors[i]._id === searchParameter){
                        doctors.splice(i, 1);
                        window.localStorage['doctors'] = JSON.stringify(doctors);

                        return {};
                    }
                }
            }else{
                console.log('client requests to delete one doctor from Server');
                return Doctor.delete({"_id":searchParameter}, function (response) {
                    if(response.status !== "OK"){
                        console.debug('Failed to delete document: ' + response.status);
                    }
                });
            }
        }

        function createDoctor(doctor){
            if(config.getOfflineMode()){
                var doctors = JSON.parse(window.localStorage['doctors']);
                doctor._id = createTmpLocalId();
                doctors.push(doctor);
                window.localStorage['doctors'] = JSON.stringify(doctors);

                return {};
            }else{
                //Locally stored documents are assigned temp ids. If this document is a locally stored one
                //remove the id-property to let the remote db assign a new one upon creation/save.
                if(doctor._id && documentHasTmpLocalId(doctor)){
                    delete doctor._id;
                }

                return Doctor.save(doctor, function (response) {
                    if(response.status !== "OK"){
                        console.debug('Failed to save document: ' + response.status);

                        return;
                    }
                    doctor._id = response._id;
                });
            }
        }
        function updateDoctor(doctor){
            if(config.getOfflineMode()){
                console.log('client requests to update one doctor on LocalStorage');
                var doctors = JSON.parse(window.localStorage['doctors']);

                for(var i = 0, len = doctors.length; i<len; i++){
                    if(doctors[i]._id === doctor._id){
                        doctors[i] = doctor;
                        window.localStorage['doctors'] = JSON.stringify(doctors);

                        return {};
                    }
                }
                console.debug('Failed to update doctor in LocalStorage: Could not find it');
            }else{
                //Locally stored documents are assigned negative ids.
                //This will not be an update but an create if id is tmpLocalId.
                //Remove the id-property to let the server db assign a new one upon creation/save.
                if(doctor._id && documentHasTmpLocalId(doctor)){
                    delete doctor._id;

                    return Doctor.save(doctor, function (response) {
                        if(response.status !== "OK"){
                            console.debug('Failed to update document: ' + response.status);

                            return;
                        }
                        console.log('Upserted doctor: ', response._id);

                        doctor._id = response._id;
                    });
                }else{
                    return Doctor.update(doctor, function (response) {
                        if(response.status !== "OK"){
                            console.debug('Failed to update document: ' + response.status);

                            return;
                        }
                        console.log('Affected doctors in Update: ', response._id);
                    });
                }
            }
        }
    }
})();