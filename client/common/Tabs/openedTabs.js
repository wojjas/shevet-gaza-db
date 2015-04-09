(function () {
    'use strict';

    angular
        .module('gdCommon')
        .factory('openedTabs', openedTabs);

    function openedTabs() {
        var tabsets = {};
        var service = {
           getTabset: function getTabset(view) {
               //if (view === "relatedContacts"){
               //    for (var tabset in tabsets){
               //        if(tabsets.hasOwnProperty(tabset) &&
               //            tabsets[tabset].length == 0){
               //            return tabsets[tabset];
               //        }
               //    }
               //}else{
               //    return tabsets[view];
               //}
               return tabsets[view];
           },
           setTabset: function (view, tabset) {
               //TODO: might have to use copy/clone here to persist:
               tabsets[view] = angular.copy(tabset);
           }
        };
        return service;

        /////////////////////////////
    }
})();