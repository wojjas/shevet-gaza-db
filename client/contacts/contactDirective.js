(function () {
    'use strict';

    angular
        .module('gdContacts')
        .directive('contactDirective', contactDirective);

    function contactDirective() {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope: {
                contactTab: "=",
                reloadTableNeeded: "=",
                hideRelation: "=",

                handleTabCloseClicked: "&",
                saveAndOpenInTab: "&"
            },
            templateUrl:'/client/contacts/contact.html',
            controller: 'ContactController',
            controllerAs: 'contactCtrl',
            bindToController: true
        };
        return directive;
    }
})();