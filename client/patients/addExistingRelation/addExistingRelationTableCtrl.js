(function () {
    'use strict';

    angular
        .module('gdPatients')
        .controller('AddExistingRelationTableController', addExistingRelationTableCtrl);

    addExistingRelationTableCtrl.$inject = ['tableService', 'rdProxy', 'loadingCover'];

    function addExistingRelationTableCtrl(tableService, rdProxy, loadingCover) {
        var vm = this;
        var tableObject = {};

        vm.table;
        vm.handleRowSelected = handleRowSelected;
        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
            tableObject = new tableService.tableObject();
            tableObject.init([], vm.rows, false);

            fillTable();
        }

        function fillTable(){
            //Don't request related contacts
            if(vm.view.indexOf('relatedContacts') !== -1){
                return;
            }

            var documentsRead = rdProxy.readAll(vm.view);

            if(documentsRead.$promise){
                //Show, after some time that table is loading.
                loadingCover.showLoadingCover('Getting ' + vm.view);

                documentsRead.$promise.then(function (response) {
                    tableObject.updateData(response);
                    vm.table = tableObject.table;

                }).catch(function (response) {
                    var errorMessage = "ERROR getting documents. " +
                        (response.statusText.length > 0 ?
                        "Server Response: " + response.statusText :
                            "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });

            }else{
                tableObject.updateData(documentsRead);
                vm.table = tableObject.table;
            }
        }

        function handleRowSelected(id){
            vm.selectedContact = id;
        }
    }
})();