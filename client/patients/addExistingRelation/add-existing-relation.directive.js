(function () {
    'use strict';

    angular
        .module('gdPatients')
        .directive('addExistingRelation', addExistingControllerDirective);

    //addExistingControllerDirective.$inject = ['$window'];

    function addExistingControllerDirective() {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope: {
                removeRelatedContact: '&'
            },
            templateUrl:'/patients/addExistingRelation/add-existing-relation.html',
            controller: 'AddExistingRelationController',
            controllerAs: 'addExistingRelationCtrl',
            bindToController: true
        };
        return directive;
    }
})();