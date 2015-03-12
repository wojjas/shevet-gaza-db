(function () {
    'use strict';

    angular
        .module('gdDoctors')
        .directive('doctorDirective', doctorDirective);

    doctorDirective.$inject = ['$window'];

    /* @ngInject */
    function doctorDirective($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope: {
                doctorTab: "=",
                reloadTableNeeded: "=",

                handleTabCloseClicked: "&",
                saveAndOpenInTab: "&"
            },
            templateUrl:'/doctors/doctor.html',
            controller: 'DoctorController',
            controllerAs: 'doctorCtrl',
            bindToController: true
        };
        return directive;
    }
})();