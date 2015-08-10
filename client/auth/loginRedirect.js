(function () {
    'use strict';

    /*
        Http-response-interceptor, redirects every responseError with status 401 to /login
     */
    angular
        .module('gdAuth')//TODO: move to communication module
        .factory('loginRedirect', loginRedirect)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('loginRedirect');
        });

    loginRedirect.$inject = ['$q', '$location', 'currentUser'];

    function loginRedirect($q, $location, currentUser) {
        var previousPath = '/login';
        var service = {
            responseError: responseError,
            redirectAfterLogin: redirectAfterLogin,
            getRestrictedPath: function(){
                return previousPath;
            }
        };

        return service;

        ////////////////

        function responseError(response) {
            if(response.status === 401){
                if($location.path() != '/login'){
                    previousPath = $location.path();
                }
                $location.path("/login");

                //server says 401, sign out if signed in, no matter reason.
                currentUser.signOut();
            }

            return $q.reject(response);
        }
        function redirectAfterLogin(){
            $location.path(previousPath);
            previousPath = '/login';
        }

    }
})();