(function () {
    'use strict';

    app.factory('crudButtons', ['$rootScope', crudButtons]);

    function crudButtons($rootScope)
    {
        var service = {
            fireEditClickedEvent: fireEditClickedEvent,
            fireCancelClickedEvent: fireCancelClickedEvent,
            fireAddClickedEvent: fireAddClickedEvent,
            fireSaveClickedEvent: fireSaveClickedEvent,
            fireSaveAndCloseClickedEvent: fireSaveAndCloseClickedEvent,
            fireDeleteClickedEvent: fireDeleteClickedEvent,

            fireIsDirty: fireIsDirty
        };

        return service;

        ////////////////

        function fireIsDirty(){
            $rootScope.$broadcast('isDirtyEvent');
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