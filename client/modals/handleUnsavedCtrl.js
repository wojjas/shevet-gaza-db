(function () {
    'use strict';

    angular
        .module('gdModals')
        .controller('HandleUnsavedController', HandleUnsaved);

    //HandleUnsaved.$inject = ['$modal'];

    function HandleUnsaved($modalInstance) {
        var vm = this;

        vm.activate = activate;
        vm.handleSaveClick = handleSaveClick;
        vm.handleContinueClick = handleContinueClick;
        vm.handleCancelClick = handleCancelClick;

        activate();

        ////////////////

        function activate() {
        }

        function handleSaveClick() {
            $modalInstance.close('save');
        };
        function handleContinueClick(){
            $modalInstance.close('continue');
        }
        function handleCancelClick() {
            $modalInstance.dismiss('cancel');
        };
    }
})();