(function () {
    'use strict';

    angular
        .module('gdCommon')
        .directive('crudButtonsDirective', crudButtonsDirective);

    function crudButtonsDirective() {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            scope: {
                close: '&',
                save: '&',
                saveAndClose: '&',
                isAddNewTab: "=",
                delete: '&',
                removeRelation: '&',
                clear: '&',
                hideSaveButtons: "="
            },
            restrict: 'E',
            templateUrl: '/common/crudButtons/crudbuttons.html'
        };
        return directive;
    }
})();