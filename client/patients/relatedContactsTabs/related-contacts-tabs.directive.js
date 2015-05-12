(function () {
    'use strict';

    angular
        .module('gdPatients')
        .directive('relatedContactsTabs', relatedContactsTabs);

        function relatedContactsTabs()
        {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            //templateUrl: '/client/common/tabs/tabs.html',
            templateUrl: '/client/patients/relatedContactsTabs/related-contacts-tabs.html',
            controller: 'TabsController',
            controllerAs: 'tabsCtrl',
            bindToController: true,
            scope: {
                view: '@',
                relatedContacts: '=',       //for Patient-details-tab
                removeRelatedContact: '&'   //for Patient-details-tab
            }
        };

        return directive;
    }
})();