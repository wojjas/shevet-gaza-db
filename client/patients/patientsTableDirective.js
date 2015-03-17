(function () {
    'use strict';

    angular
        .module('gdPatients')
        .directive('patientsTable', patientsTable);

    function patientsTable() {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope: {
                view: '@',
                templatePath: '@',
                handleTableRowClicked: "&",
                closeTabDeletedInTable: "&"
            },
            // TODO: find a way to dynamically specify templateUrl so only ONE directive can be used
            //       with template="{{tab.template}}" in HTML
            //See: http://plnkr.co/edit/HEyUUzv6jbjZCDDbAzPm?p=preview
            templateUrl: '/client/patients/patients.html',
            controller: 'TableController',
            controllerAs: 'tableCtrl',
            bindToController: true
        };

        return directive;
    }
})();