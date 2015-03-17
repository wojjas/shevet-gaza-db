(function () {
    'use strict';

    angular
        .module('gdDoctors')
        .directive('doctorsTable', doctorsTable);

    //doctorTable.$inject = ['$window'];

    function doctorsTable() {
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
            //templateUrl: function(element, attrs){
            //    return attrs.template + " ";
            //},
            //template: '<div ng-include="\'/client/doctors/doctors.html\'"></div>',
            //template: '<ng-include src="templatePath"></ng-include>',
            templateUrl: '/client/doctors/doctors.html',
            controller: 'TableController',
            controllerAs: 'tableCtrl',
            bindToController: true
        };

        return directive;
    }
})();