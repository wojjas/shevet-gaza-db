(function () {
    'use strict';

    angular
        .module('gdPatients')
        .directive('addExistingRelationTable', addExistingRelationTable);

    function addExistingRelationTable()
    {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope: {
                view: '@',      //TODO: Needed?
                rows: '@',
                selectedContact: '=',
                specifiedRelation: '=',
                alreadyRelated: '='
            },
            templateUrl:'/client/patients/addExistingRelation/add-existing-relation-table.html',
            controller: 'AddExistingRelationTableController',
            controllerAs: 'addExistingRelationTableCtrl',
            bindToController: true
        };
        return directive;
    }
})();