(function () {
    'use strict';

    angular
        .module('gdAuth')
        .factory('oauth', oauth);

    oauth.$inject = ['$http', 'formEncoder', 'currentUser', 'CONFIG'];

    function oauth($http, formEncoder, currentUser, CONFIG) {
        var service = {
            login: login
        };

        return service;

        ////////////////

        function login(username, password) {
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

            return $http.post(CONFIG.apiUrl + "/login", data, config)
                .success(function (response) {
                    console.log('Server response: ', response);
                    currentUser.setProfile(username, response.token);})
                .error(function (err) {
                    console.log('Error: ', err);
            });
        }
    }
})();