(function () {
    'use strict';

    angular
        .module('gdContacts')
        .controller('ContactNumbersController', ContactNumbers);

    function ContactNumbers() {
        var vm = this;

        vm.handleDeleteRow = handleDeleteRow;
        vm.handleAddRow = handleAddRow;
        vm.disableAddButton = disableAddButton;
        vm.getTableContentClass = getTableContentClass;

        ///////////////////////////

        function handleDeleteRow(row) {
            console.log("delete row: " + row);
            vm.data.splice(row, 1);
        }
        function handleAddRow(description, data) {
            vm.data.push({});
        }
        function disableAddButton(row){
            return !vm.data[row].description && !vm.data[row].number;
        }
        function getTableContentClass(){
            return vm.high ? 'div-table-content-high' : 'div-table-content-low';
        }
    }
})();