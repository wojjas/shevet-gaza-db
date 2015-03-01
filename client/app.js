(function () {
    'use strict';

    var app = angular.module('gazaApp', [
        'ngResource',
        'ngRoute',
        'ngTable',
        'ui.bootstrap',

        //gazaDB modules:
        'gdCommon',
        'gdDoctors',
        'gdHome',
        'gdLoadingCover',
        'gdModals'
    ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'home/home.html'
    //            controller: 'home as vm'
            }).
            when('/tabset/:list', {
                templateUrl: 'common/tabset.html',
                controller: 'TabsController as tabsCtrl'
            }).
            when('/patients', {
                templateUrl: 'patients/patients.html'
    //            controller: 'home as vm'
            }).
            when('/settings', {
                templateUrl: 'settings/settings.html'
    //            controller: 'home as vm'
            }).
            otherwise({
                retirectTo: '/home'
            })
    }]);
})();