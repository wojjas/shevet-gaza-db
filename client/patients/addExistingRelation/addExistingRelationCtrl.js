(function () {
    'use strict';

    angular
        .module('gdPatients')
        .controller('AddExistingRelationController', addExistingRelation);

    //addExistingRelation.$inject = ['DEP'];

    function addExistingRelation() {
        var vm = this;

        vm.specifiedRelation = '';
        vm.selectedContact = null;
        vm.handleRelatedContactSelected = handleRelatedContactSelected;
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
        function handleAddRelation(){
            //7 Add Relation button clicked, add this relation to Patient's related contacts by adding Patien's method for doing this.
            //7 specifing vm.selectedContact & vm.specifiedRelation.
        }
        function handleCancel(){
            vm.selectedContact = null;
            vm.specifiedRelation = '';
            vm.selectFirstTab();
        }
    }
})();