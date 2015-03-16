(function () {
    'use strict';

    angular
        .module('gdCommon')
        .directive('tabs', tabs);

    function tabs() {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            templateUrl: '/client/common/tabs/tabs.html',
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