(function () {
    'use strict';

    angular
        .module('gdContacts')
        .directive('contactDirective', contactDirective);

    contactDirective.$inject = ['$window'];

    /* @ngInject */
    function contactDirective($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope: {
                contactTab: "=",
                reloadTableNeeded: "=",
                hideRelation: "@",

                handleTabCloseClicked: "&",
                saveAndOpenInTab: "&"
            },
            templateUrl:'/contacts/contact.html',
            controller: 'ContactController',
            controllerAs: 'contactCtrl',
            bindToController: true
        };
        return directive;
    }
})();