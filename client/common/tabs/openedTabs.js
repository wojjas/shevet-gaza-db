(function () {
    'use strict';

    angular
        .module('gdCommon')
        .factory('openedTabs', openedTabs);

    function openedTabs() {
        var tabsets = {};
        var service = {
           getTabset: function getTabset(view) {
               return tabsets[view];
           },
           setTabset: function (view, tabset) {
               tabsets[view] = angular.copy(tabset);
           },
           removeTabset: function(view){
               delete tabsets[view];
           }
        };
        return service;
    }
})();