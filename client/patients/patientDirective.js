(function () {
    'use strict';

    angular
        .module('gdPatients')
        .directive('patientDirective', patientDirective);

    patientDirective.$inject = ['$window'];

    /* @ngInject */
    function patientDirective($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope: {
                patientTab: "=",
                reloadNeeded: "=",

                handleTabCloseClicked: "&",
                saveAndOpenInTab: "&"
            },
            templateUrl:'/patients/patient.html',
            controller: 'PatientController',
            controllerAs: 'patientCtrl',
            bindToController: true
        };
        return directive;
    }
})();