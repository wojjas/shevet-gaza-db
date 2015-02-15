(function () {
    'use strict';

    angular
        .module('gdHome')
        .controller('crudButtonsCtrl', ['$scope', 'crudButtons', CrudButtonsCtrl]);

    function CrudButtonsCtrl($scope, crudButtons)
    {
        var vm = this;
        vm.isInEditMode = false;
        vm.isDirty = true;
        vm.isLocked = false;             //if true every button is disabled, if false enable according to other flags

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

        //Events:
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

        //External events:
        $scope.$on('isDirtyEvent', function () {
            vm.isDirty = false;
        })
        $scope.$on('lockEvent', function (event, args) {
            vm.isLocked = args.lock;
        })
    }
})();