(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('DatePickerController', ['$filter', 'config', DatePicker]);

    function DatePicker($filter, config) {
        var vm = this;

        vm.minDate = '1850-01-01';
        vm.maxDate = '2050-01-01';
        vm.format = config.dateFormat;
        vm.opened = false;

        vm.handleOpen = handleOpen;
        vm.handleChange = handleChange;
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

        //HACK:
        //ui.bootstrap.datepicker sets picked date's time to midnight.
        //when serialized for sending JS' Date compensates date's time with client's time-zone
        //which could result in changing the date! Likewise getting UTC from db and adding or subtracting
        //time-zone-offset could also result in change of date.
        //The HACK here is to set the unwanted time to noon, giving margin for most (but not all!) time-zones.
        function handleChange(){
            //vm.date = $filter('date')(vm.date, 'yyyy-MM-ddT12:00:00+02:00');
            vm.date = $filter('date')(vm.date, 'yyyy-MM-ddT12:00:00.000Z');
        }
    }
})();