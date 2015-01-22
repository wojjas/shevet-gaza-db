var app = angular.module('gazaApp', [
    'ngResource',
    'ngRoute',
    'ngTable'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'home/home.html'
//            controller: 'home as vm'
        }).
        when('/doctors', {
            templateUrl: 'doctors/doctors.html',
            controller: 'doctors as vm'
        }).
        when('/doctor/:id', {
            templateUrl: 'doctors/doctor.html',
            controller: 'doctor as vm'
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
}])