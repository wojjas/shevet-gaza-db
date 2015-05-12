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
                //handleTableRowClicked: "&",
                removeRelation: "&"
                //closeTabDeletedInTable: "&"
            },
            templateUrl:'/client/patients/addExistingRelation/add-existing-relation-table.html',
            controller: 'AddExistingRelationTableController',
            controllerAs: 'addExistingRelationTableController',
            bindToController: true
        };
        return directive;
    }
})();