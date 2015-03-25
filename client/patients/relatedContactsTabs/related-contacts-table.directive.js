(function () {
    'use strict';

    angular
        .module('gdPatients')
        .directive('relatedContactsTable', relatedContactsTable);

    function relatedContactsTable() {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope: {
                view: '@',
                rows: '@',              //for relatedContacts
                showRelation: '=',      //for relatedContacts
                relatedContacts: '=',   //for relatedContacts
                templatePath: '@',
                handleTableRowClicked: "&",
                closeTabDeletedInTable: "&"
            },
            // TODO: find a way to dynamically specify templateUrl so only ONE directive can be used
//            templateUrl: '/client/contacts/contacts.html',
            templateUrl: '/client/patients/relatedContactsTabs/related-contacts-table.html',
            controller: 'TableController',
            controllerAs: 'tableCtrl',
            bindToController: true
        };

        return directive;
    }
})();