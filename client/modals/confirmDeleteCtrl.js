(function () {
    'use strict';

    angular
        .module('gdModals')
        .controller('ConfirmDeleteController', ConfirmDelete);

    //ConfirmDelete.$inject = ['$modal'];

    function ConfirmDelete($modalInstance, contextData) {
        var vm = this;

        vm.objectName = '';
        vm.objectType = '';
        vm.activate = activate;
        vm.handleDeleteClick = handleDeleteClick;
        vm.handleCancelClick = handleCancelClick;

        activate();

        ////////////////

        function activate() {
            vm.objectName = contextData.name;
            vm.objectType = contextData.type;
        }

        function handleDeleteClick() {
            $modalInstance.close('delete');
        };

        function handleCancelClick() {
            $modalInstance.dismiss('cancel');
        };
    }
})();