(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('DatePickerController', ['$scope', DatePicker]);

    function DatePicker($scope) {
        var vm = this;

        vm.minDate = '1850-01-01';
        vm.maxDate = '2050-01-01';
        vm.opened = false;

        vm.handleOpen = handleOpen;
        vm.activate = activate;

        activate();

        ///////////////////

        function handleOpen($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        }

        function activate() {
            if (vm.context === "birth" || vm.context === "deceased") {
                vm.maxDate = new Date();
            }
        }
    }
})();