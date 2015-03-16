(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('ViewController', ['$routeParams', View]);

    function View($routeParams) {
        var vm = this;

        vm.title = 'View';
        vm.currentView = 'home';
        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
            console.log('viewCtrl: ' + $routeParams.view);
            vm.currentView = $routeParams.view;
        }
    }
})();