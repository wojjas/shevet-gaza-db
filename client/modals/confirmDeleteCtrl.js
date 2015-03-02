(function () {
    'use strict';

    angular
        .module('gdModals')
        .controller('ConfirmDeleteController', ConfirmDelete);

    //ConfirmDelete.$inject = ['$modal'];

    function ConfirmDelete($modalInstance, doctorName) {
        var vm = this;

        vm.doctorName = '';
        vm.activate = activate;
        vm.handleDeleteClick = handleDeleteClick;
        vm.handleCancelClick = handleCancelClick;

        activate();

        ////////////////

        function activate() {
            vm.doctorName = doctorName;
        }

        function handleDeleteClick() {
            $modalInstance.close('delete');
        };

        function handleCancelClick() {
            $modalInstance.dismiss('cancel');
        };
    }
})();