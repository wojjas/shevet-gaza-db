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
            return !vm.data[row].contactDescription && !vm.data[row].contactData;
        }
        function getTableContentClass(){
            //TODO: make this work for that precious extra 10 visual px. In patient-details.
            return !vm.high ? 'div-table-content-high' : 'div-table-content-low';
        }
    }
})();