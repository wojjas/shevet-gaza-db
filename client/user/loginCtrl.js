(function () {
    'use strict';

    angular
        .module('gdUser')
        .controller('LoginController', loginCtrl);

    loginCtrl.$inject = ['oauth', 'loginRedirect'];

    function loginCtrl(oauth, loginRedirect) {
        var vm = this;

        vm.username = '';
        vm.password = '';
        vm.handleSubmit = handleSubmit;
        vm.handleUsernameChange = handleUsernameChange;
        vm.disableSubmitBtn = disableSubmitBtn;
        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
            //TODO: set last known user from session-storage if logged out because of expire?
        }
        function handleSubmit(){
            oauth.login(vm.username, vm.password)
                .then(function () {
                    loginRedirect.redirectAfterLogin();
                })
                .catch(function (err) {
                    //TODO: do some nice visual feedback that login failed
                    var message = 'Login failed' + (err ? ': ' + err.statusText : '');
                    console.log(message);
                })
                .finally(vm.username = vm.password = '');
        }
        function handleUsernameChange(){
            vm.username = vm.username.toLowerCase();
        }
        function disableSubmitBtn(){
            return vm.username.length == 0 || vm.password.length == 0;
        }
    }
})();