(function () {
    'use strict';

    angular
        .module('gdPatients')
        .controller('AddExistingRelationController', addExistingRelation);

    //addExistingRelation.$inject = ['DEP'];

    function addExistingRelation() {
        var vm = this;

        vm.title = 'addExistingRelation Ctrl';
        vm.activate = activate;
        vm.handleTableRowButtonClicked = handleTableRowButtonClicked;

        activate();

        ////////////////

        function activate() {
            //alert('AddExistingRelationController');
        }

        function handleTableRowButtonClicked(contactId){
            //TODO: depending on what button was clicked perform whole CRUD:

            vm.removeRelatedContact(contactId);
            //TODO: re-load table or remove mark in some other way
        }
    }
})();