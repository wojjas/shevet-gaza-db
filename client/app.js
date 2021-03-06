(function () {
    'use strict';

    var app = angular.module('gazaApp', [
        'ngResource',
        'ngRoute',
        'ngTable',
        'ui.bootstrap',

        //gazaDB modules:
        'gdCommon',
        'gdPhoto',
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
                templateUrl: 'settings/settings.html',
                controller: 'SettingsController',
                controllerAs: 'settingsCtrl'
            })
            .otherwise({
                retirectTo: '/home'
            })
    }]);
})();