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

    loginRedirect.$inject = ['$q', '$location'];

    function loginRedirect($q, $location) {
        var previousPath = '/login';
        var service = {
            responseError: responseError,
            redirectAfterLogin: redirectAfterLogin
        };

        return service;

        ////////////////

        function responseError(response) {
            if(response.status === 401){
                if($location.path() != '/login'){
                    previousPath = $location.path();
                }
                $location.path("/login");
            }

            return $q.reject(response);
        }
        function redirectAfterLogin(){
            $location.path(previousPath);
            previousPath = '/login';
        }

    }
})();