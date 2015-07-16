(function () {
    'use strict';

    angular
        .module('gdUser')
        .controller('LoginController', loginCtrl);

    loginCtrl.$inject = ['oauth', 'loginRedirect'];

    function loginCtrl(oauth, loginRedirect) {
        var vm = this;

        vm.email = '';
        vm.password = '';
        vm.handleLoginClick = handleLoginClick;
        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
            //TODO: set last known user from session-storage if logged out because of expire?
        }
        function handleLoginClick() {
            oauth.login(vm.email, vm.password)
                .then(function () {
                    loginRedirect.redirectAfterLogin();
                })
                .catch(function () {
                    //TODO: do some nice visual feedback that login failed
                    console.log('Server rejected login attempt')
                })
                .finally(vm.email = vm.password = '');
        }
    }
})();