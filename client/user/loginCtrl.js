(function () {
    'use strict';

    angular
        .module('gdUser')
        .controller('LoginController', loginCtrl);

    loginCtrl.$inject = ['oauth', 'loginRedirect', 'notifier'];

    function loginCtrl(oauth, loginRedirect, notifier) {
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
            var desiredView = loginRedirect.getRestrictedPath().split('/')[2];
            if(desiredView && desiredView !== "login") {
                desiredView = desiredView.charAt(0).toUpperCase() + desiredView.slice(1);
                var toastrMessage = "Login required to access <strong>" + desiredView + "</strong>";

                notifier.warning(toastrMessage, 'Access denied');
            }
        }
        function handleSubmit(){
            oauth.login(vm.username, vm.password)
                .then(function () {
                    loginRedirect.redirectAfterLogin();
                    var toastrMessage = "Access granted to:</br> Doctors, Patients and Contacts";
                    notifier.success(toastrMessage, 'Login Succeeded');
                })
                .catch(function (err) {
                    var message = 'Login failed' + (err ? ': ' + err.statusText : '');
                    console.log(message);
                    notifier.error((err ? err.statusText : ''), 'Login Failed');
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