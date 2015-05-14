(function () {
    'use strict';

    angular
        .module('gdPatients')
        .controller('AddExistingRelationController', addExistingRelation);

    addExistingRelation.$inject = ['$timeout'];

    function addExistingRelation($timeout) {
        var vm = this;

        vm.selectedContact = null;
        vm.specifiedRelation = '';
        vm.handleRelatedContactSelected = handleRelatedContactSelected;
        vm.isAddRelationDisabled = isAddRelationDisabled;
        vm.handleAddRelation = handleAddRelation;
        vm.handleCancel = handleCancel;

        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
        }

        function handleRelatedContactSelected(id){
            vm.selectedContact = id;
        }
        function isAddRelationDisabled(){
            return !vm.selectedContact || vm.specifiedRelation === '';
        }
        function handleAddRelation(){
            var innerContact = vm.selectedContact;
            innerContact.relation = vm.specifiedRelation;
            var contact = {};
            contact.contact = innerContact;
            contact.relation = vm.specifiedRelation;
            vm.addRelatedContact({contact: contact});

            resetFormValues();
            vm.reloadTableNeeded = true;
            //Give angular time to update the reloadTableNeeded flag before calling selectFirstTab,
            //yes, 0ms is enough... This flag is bound through directive, isolated scope using "=".
            $timeout(function(){
                vm.selectFirstTab();
            }, 0);
        }
        function handleCancel(){
            resetFormValues();
            vm.selectFirstTab();
        }

        function resetFormValues(){
            vm.selectedContact = null;
            vm.specifiedRelation = '';
        }
    }
})();