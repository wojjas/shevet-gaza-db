(function () {
    'use strict';

    angular
        .module('gdCommon')
        .directive('datePicker', datePickerDirective);

    function datePickerDirective() {
        // Usage:
        // <date-picker context='birth' date="patientCtrl.birthDate"></date-picker>
        var directive = {
            restrict: 'E',
            templateUrl: '/client/common/datePicker/datepicker.html',
            controller: 'DatePickerController',
            controllerAs: 'datePickerCtrl',
            scope: {
                context: "@",
                date: "="
            },
            bindToController: true
        };

        return directive;
    }
})();