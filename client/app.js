(function () {
    'use strict';

    var app = angular.module('gazaApp', [
        'ngResource',
        'ngRoute',
        'ngTable',
        'ui.bootstrap',

        //gazaDB modules:
        'gdCommon',
        'gdAuth',
        'gdUser',
        'gdContacts',
        'gdDoctors',
        'gdPatients',
        'gdHome',
        'gdLoadingCover',
        'gdModals'
    ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'home/home.html'
            })
            .when('/login', {
                templateUrl: 'user/login.html',
                controller: 'LoginController',
                controllerAs: 'loginCtrl'
            })
            .when('/views/:view', {
                templateUrl: 'common/view.html',
                controller: 'ViewController',
                controllerAs: 'viewCtrl'
            })
            .when('/settings', {
                templateUrl: 'settings/settings.html'
            })
            .otherwise({
                retirectTo: '/home'
            })
    }]);

    app.constant('CONFIG', {
        "apiUrl": "https://localhost:3001/api",
        "maxNumberOfNotes": "8"
    });
})();