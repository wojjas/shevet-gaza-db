(function () {
    'use strict';

    angular
        .module('gdHome')
        .factory('crudButtons', ['$rootScope', crudButtons]);

    function crudButtons($rootScope)
    {
        var service = {
            fireEditClickedEvent: fireEditClickedEvent,
            fireCancelClickedEvent: fireCancelClickedEvent,
            fireAddClickedEvent: fireAddClickedEvent,
            fireSaveClickedEvent: fireSaveClickedEvent,
            fireSaveAndCloseClickedEvent: fireSaveAndCloseClickedEvent,
            fireDeleteClickedEvent: fireDeleteClickedEvent,

            fireIsDirty: fireIsDirty,
            fireLock: fireLock                  //disable/enable all buttons.
        };

        return service;

        ////////////////

        function fireIsDirty(){
            $rootScope.$broadcast('isDirtyEvent');
        }
        function fireLock(lock){
            $rootScope.$broadcast('lockEvent', {lock:lock});
        }

        function fireEditClickedEvent() {
            $rootScope.$broadcast('editClickedEvent');
        }
        function fireCancelClickedEvent(){
            $rootScope.$broadcast('cancelClickedEvent');
        }
        function fireAddClickedEvent(){
            $rootScope.$broadcast('addClickedEvent');
        }
        function fireSaveClickedEvent(){
            $rootScope.$broadcast('saveClickedEvent');
        }
        function fireSaveAndCloseClickedEvent(){
            $rootScope.$broadcast('saveAndCloseClickedEvent');
        }
        function fireDeleteClickedEvent(){
            $rootScope.$broadcast('deleteClickedEvent');
        }
    }
})();