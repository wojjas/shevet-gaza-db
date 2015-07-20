(function () {
    'use strict';

    angular
        .module('gdUser')
        .controller('UserController', user);

    user.$inject = ['$location', 'currentUser'];

    function user($location, currentUser) {
        var vm = this;

        vm.userProfile = currentUser.profile;

        vm.handleSignOut = handleSignOut;
        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
        }

        function handleSignOut() {
            currentUser.signOut();
            $location.path("/login");
        }
    }
})();