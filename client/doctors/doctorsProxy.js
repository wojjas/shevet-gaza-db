/*
* Doctor service, communicates with server to perform CRUD on doctors collection.
* Saves gotten doctor or doctors in local storage.
* Saves/gets selectedDoctor in/from local storage for communication between controllers.
* */
(function () {
    'use strict';

    app.factory('doctors', ['$resource', 'config', doctors]);

    function doctors($resource, config) {
        var Doctor = {};          /*Main resource*/

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
                return Doctor.query(function (results) {
                    window.localStorage['doctors'] = JSON.stringify(results);
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

                return Doctor.get({"_id":searchParameter}, function (result) {
                    window.localStorage['doctor'] = JSON.stringify(result);
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

                        break;
                    }
                }
            }else{
                console.log('client requests to delete one doctor from Server');
                Doctor.delete({"_id":searchParameter}, function (result) {
                    console.log('Server response: ', result);
                });
            }
        }

        //Creates or Updates a doctor, used for both "Add" and "Edit"
//        function saveDoctor(doctorToSave) {
//            console.log("client requests to create/update one doctor");
//
//            Doctor.save(doctorToSave, function (result) {
//               console.log('Affected doctors in Create/Update: ', result);
//            });
//        }

        function createDoctor(doctor){
            if(config.getOfflineMode()){
                var doctors = JSON.parse(window.localStorage['doctors']);
                doctors.push(doctor);
                window.localStorage['doctors'] = JSON.stringify(doctors);
            }else{
                //TODO: Duplication of code, yes, but the "new Doctor(...)" makes the editor freak out.
                //noinspection JSUnresolvedFunction
//                var newDoctor = new Doctor(doctor);
                var newDoctor = new $resource('/api/doctors/:_id', {id:'@_id'}, {update: {method: 'PUT'}})(doctor);

                newDoctor.$save(function (result) {
                    console.log('Saved new doctor: ', result);
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

                        break;
                    }
                }
            }else{
                Doctor.update(doctor, function (result) {
                    console.log('Affected doctors in Create/Update: ', result);
                });
            }
        }

    }
})();