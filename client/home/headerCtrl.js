(function () {
    'use strict';

    angular
        .module('gdHome')
        .controller('HeaderController', Header);

    Header.$inject = ['config'];

    /* @ngInject */
    function Header(config) {
        var vm = this;

        vm.offline = false;

        vm.activate = activate;
        vm.handleOfflineModeChanged = handleOfflineModeChanged;

        activate();

        ////////////////

        function activate() {
            vm.offline = config.getOfflineMode();
        }

        function handleOfflineModeChanged(){
            config.setOfflineMode(vm.offline);
        }
    }
})();