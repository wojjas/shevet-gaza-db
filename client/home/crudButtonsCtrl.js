(function () {
    'use strict';

    app.controller('crudButtonsCtrl', ['$scope', 'crudButtons', CrudButtonsCtrl]);

    function CrudButtonsCtrl($scope, crudButtons)
    {
        var vm = this;
        vm.isInEditMode = false;
        vm.isDirty = true;

        vm.activate = activate;
        vm.handleEditBtnClick = handleEditBtnClick;
        vm.handleAddBtnClick = handleAddBtnClick;
        vm.handleSaveBtnClick = handleSaveBtnClick;
        vm.handleSaveAndCloseBtnClick = handleSaveAndCloseBtnClick;
        vm.handleCancelBtnClick = handleCancelBtnClick;
        vm.handleDeleteBtnClick = handleDeleteBtnClick;

        activate();

        ////////////////
        function activate(){
            vm.isInEditMode = false;
        }

        function handleEditBtnClick() {
            vm.isInEditMode = true;
            vm.isDirty = true;
            crudButtons.fireEditClickedEvent();
        }
        function handleAddBtnClick() {
            vm.isInEditMode = true;
            vm.isDirty = true;
            crudButtons.fireAddClickedEvent();
        }
        function handleSaveBtnClick() {
            //vm.isInEditMode = false;
            crudButtons.fireSaveClickedEvent();
        }
        function handleSaveAndCloseBtnClick() {
            //vm.isInEditMode = false;
            crudButtons.fireSaveAndCloseClickedEvent();
        }
        function handleCancelBtnClick(){
            vm.isInEditMode = false;
            crudButtons.fireCancelClickedEvent();
        }
        function handleDeleteBtnClick(){
            vm.isInEditMode = false;
            crudButtons.fireDeleteClickedEvent();
        }

        $scope.$on('isDirtyEvent', function () {
            vm.isDirty = false;
        })
    }
})();