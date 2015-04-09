(function () {
    'use strict';

    angular
        .module('gdCommon')
        .directive('viewTabs', tabs);

    function tabs() {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            templateUrl: '/client/common/Tabs/tabs.html',
            controller: 'TabsController',
            controllerAs: 'tabsCtrl',
            bindToController: true,
            scope: {
                view: '@'
            }
        };
        return directive;
    }
})();