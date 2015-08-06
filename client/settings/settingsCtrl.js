(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('SettingsController', settingsCtrl);

    settingsCtrl.$inject = ['$http', 'currentUser'];

    function settingsCtrl($http, currentUser) {
        var vm = this;

        vm.version = '';
        vm.databaseIsConnected= '';
        vm.dbConnectionString = '';
        vm.currentUser = currentUser.profile.isLoggedIn && currentUser.profile.username;
        vm.lastChecked = '';

        vm.handleUpdate = handleUpdate;
        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
            updateStatus();
        }
        function handleUpdate(){
            updateStatus();
        }

        function updateStatus(){
            vm.lastChecked = new Date();

            $http.get("/info")
                .success(function(response){
                    vm.version = response.version || 'UNKNOWN';
                    vm.databaseIsConnected = response.databaseIsConnected;
                    vm.dbConnectionString = response.dbConnectionString;
                })
                .error(function(err){
                    console.log('Error ', err);
                })
        }
    }
})();