(function () {
    'use strict';

    var app = angular.module('gazaApp', [
        'ngResource',
        'ngRoute',
        'ngTable',
        'ui.bootstrap',

        //gazaDB modules:
        'gdCommon',
        'gdContacts',
        'gdDoctors',
        'gdPatients',
        'gdHome',
        'gdLoadingCover',
        'gdModals'
    ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'home/home.html'
            }).
            when('/views/:view', {
                templateUrl: 'common/view.html',
                controller: 'ViewController as viewCtrl'
            }).
            when('/settings', {
                templateUrl: 'settings/settings.html'
            }).
            otherwise({
                retirectTo: '/home'
            })
    }]);
})();