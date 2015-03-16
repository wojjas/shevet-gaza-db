(function () {
    'use strict';

    angular
        .module('gdContacts')
        .directive('contactNumbers', contactNumbers);

    function contactNumbers() {
        // Usage:
        // <contact-numbers data='someCtr.contactData'></contact-numbers>
        // Creates:
        // A editable table for a contact's numbers: home phone, cell phone, office fax, etc.
        var directive = {
            restrict: 'E',
            templateUrl: '/client/contacts/contactNumbers/contactnumbers.html',
            controller: 'ContactNumbersController',
            controllerAs: 'contactNumbersCtrl',
            scope: {
                data: '=',
                high: '@'
            },
            bindToController: true
        };

        return directive;
    }
})();