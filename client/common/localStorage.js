(function () {
    'use strict';

    /*
    * A wrapper around local-storage. To serialize/deserialize and use key.
    * */
    angular
        .module('gdCommon')
        .factory('localStorage', localStorage);

    localStorage.$inject = ['$window'];

    function localStorage($window)
    {
        var store = $window.localStorage;
        var service = {
            get: get,
            add: add,
            remove: remove
        };

        return service;

        ////////////////

        function get(key) {
            var value = store.getItem(key);
            value && (value = angular.fromJson(value));

            return value;
        }
        function add(key, value) {
            value = angular.toJson(value);
            store.setItem(key, value);
        }
        function remove(key) {
            store.removeItem(key);
        }
    }
})();