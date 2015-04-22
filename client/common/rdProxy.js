/*
* CRUD service (partly implemented RD), communicates with server to perform CRUD on a collection.
* Saves gotten document or documents in local storage.
* */
(function () {
    'use strict';

    angular
        .module('gdCommon')
        .factory('rdProxy', ['$resource', 'config', rd]);

    //Performs Read all and Delete against LocalStorage and, or remote db.
    //Every document stored in LocalStorage is assigned an unique string with known prefix as _id.
    //This is needed to be able to CRUD it against LocalStorage.
    //Upon each save to remote db, if this tmp-id exists it is removed so that the remote db
    //can assign an _id to this document. Upon successful save this _id is assigned to the
    //document in LocalStorage so that remote and local data is in sync.
    function rd($resource, config) {
        var service = {
            //createNewDoctor: createNewDoctor,
            //Server communication: CRUD
            readAll: readAll,
            //readOneDoctor: readOneDoctor,
            deleteOne: deleteOne
            //createDoctor: createDoctor,
            //updateDoctor: updateDoctor
        };

        //init();

        return service;

        ////////////////

        function init(view){
            var apiUrl = '/api/' + view +'/:_id';
            return $resource(apiUrl, {id:'@_id'}, {update: {method: 'PUT'}});
        }

        function readAll(view){
            if(config.getOfflineMode()){
                console.log('client requests all doctors from LocalStorage');
                if(window.localStorage[view]){
                    return JSON.parse(window.localStorage[view]);
                }
                return [];
            }else{
                console.log('client requests all ' + view + ' from Server');
                var ServerResource = init(view);
                return ServerResource.query(function (response) {
                    window.localStorage[view] = angular.toJson(response.data);
                }, function (error) {
                    console.debug("Error getting " + view + ": ", error);
                });
            }
        }

        function deleteOne(view, searchParameter){
            if(config.getOfflineMode()){
                console.log('client requests to delete one document from LocalStorage');
                var documents = JSON.parse(window.localStorage[view]);

                for(var i = 0, len = documents.length; i<len; i++){
                    if(documents[i]._id === searchParameter){
                        documents.splice(i, 1);
                        window.localStorage[view] = angular.toJson(documents);

                        return {};
                    }
                }
            }else{
                console.log('client requests to delete one document from Server collection' + view);
                var ServerResource = init(view);

                return ServerResource.delete({"_id":searchParameter}, function (response) {
                    if(response.status !== "OK"){
                        console.debug('Failed to delete document: ' + response.status);
                    }
                });
            }
        }
    }
})();