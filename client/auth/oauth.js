(function () {
    'use strict';

    angular
        .module('gdAuth')
        .factory('oauth', oauth);

    oauth.$inject = ['$http', '$window', '$q', 'formEncoder', 'currentUser'];

    function oauth($http, $window, $q, formEncoder, currentUser) {
        var service = {
            login: login
        };

        return service;

        ////////////////

        function login(username, password) {
            //If not in debug-mode we are probably running on localhost or the developer knows what he's doing, no need for this check.
            if(process.env.IN_PRODUCTION_MODE){
                if($window.location.protocol !== 'https:'){
                    $window.alert('Attempted to send credentials not using https. \n' +
                    'This is unsafe and not allowed.');

                    return $q.reject({statusText:'Login attempt canceled at client. Tried to use unsafe protocol for sending credentials.'});
                }
            }

            var config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            var data = formEncoder.encode({
                username: username,
                password: password,
                grant_type: "password"
            });

            return $http.post("/api/login", data, config)
                .success(function (response) {
                    console.log('Server response: ', response);
                    currentUser.setProfile(username, response.token);})
                .error(function (err) {
                    console.log('Error: ', err);
            });
        }
    }
})();