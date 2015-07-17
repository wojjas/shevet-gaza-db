(function () {
    'use strict';

    angular
        .module('gdUser')
        .directive('gdCurrentUser', user);

    function user()
    {
        var directive = {
            restrict: 'E',
            templateUrl: './user/user.html',
            controller: 'UserController',
            controllerAs: 'userCtrl',
            bindToController: true
        };
        return directive;
    }
})();