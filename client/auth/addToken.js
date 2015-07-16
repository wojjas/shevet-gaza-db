(function () {
    'use strict';

    /*
        HTTP-Interceptor, if user is logged in, add user's token to the header of the request.

        Just add this script to index.html like so: <script src="client/auth/addToken.js"></script>
        and httpProvider will run the added (to "interceptors" array) "addToken" method.
     */
    angular
        .module('gdAuth')
        .factory('addToken', addToken)
        .config(function ($httpProvider) {
        $httpProvider.interceptors.push("addToken");
    })

    addToken.$inject = ['currentUser', '$q'];

    function addToken(currentUser, $q) {
        var service = {
            request: request
        };

        return service;

        ////////////////

        function request(config) {
            if(currentUser.profile.isLoggedIn){
                config.headers.Authorization = "Bearer " + currentUser.profile.token;
            }
            return $q.when(config);
        }
    }
})();