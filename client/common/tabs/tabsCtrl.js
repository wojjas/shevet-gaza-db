(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('TabsController', ['$scope', '$routeParams', 'tabsets', '$modal', Tabs]);

    function Tabs($scope, $routeParams, tabsets, $modal) {
        var vm = this;

        var tabTemplate = '';

        vm.title = 'Tabs Ctrl';
        vm.currentView = '';
        vm.tabs = [];
        vm.reloadTableNeeded = false;  //Reload of first-tab, the table, is needed

        vm.activate = activate;
        vm.handleTabSelect = handleTabSelect;
        vm.handleTabCloseClicked = handleTabCloseClicked;
        vm.handleTableRowClicked = handleTableRowClicked;

        vm.saveAndOpenInTab = saveAndOpenInTab;
        vm.closeTabDeletedInTable = closeTabDeletedInTable;

        activate();

        ////////////////

        function activate() {
            console.log('tabsCtrl: ' + vm.view);
            vm.currentView = vm.view;

            if(!tabsets.getTabset(vm.currentView)){
                tabsets.initTabset(vm.currentView);
            }
            vm.tabs = tabsets.getTabset(vm.currentView);
        }
        function showConfirmClose(currentTab){
            var modalInstance = $modal.open({
                templateUrl: 'modals/handle_unsaved.html',
                controller: 'HandleUnsavedController as handleUnsavedCtrl',
                backdrop: 'static'
            });

            modalInstance.result.then(function (modalResult) {
                if(modalResult === 'save'){
                    $scope.$broadcast('saveAndCloseEvent', currentTab.id);
                }else{
                    handleTabCloseClicked(currentTab, true);
                }
            }, function () {
                console.log('Tab close dismissed.');
            });
        }

        function saveAndOpenInTab(data){
            tabsets.openInTabCreateIfNeeded(vm.currentView, data);
        }
        function closeTabDeletedInTable(id){
            tabsets.closeSpecifiedTab(vm.currentView, id);
        }

        //Event Handlers:
        function handleTabSelect(tab){
            if(tab.isFirstTab && vm.reloadTableNeeded){
                vm.reloadTableNeeded = false;
                //reloadTableEvent
                $scope.$broadcast('reloadTableEvent');
            }
        }
        function handleTabCloseClicked(currentTab, doNotConfirm){
            //Check for unsaved changes and demand confirmation.
            if(!doNotConfirm && (currentTab && !currentTab.isFirstTab && currentTab.isDirty())){
                showConfirmClose(currentTab);
            }else{
                if(currentTab.isAddTab){
                    tabsets.openTab(vm.currentView, 0);
                }else{
                    tabsets.closeSpecifiedTab(vm.currentView, currentTab.id);
                }
            }
        }
        function handleTableRowClicked(data){
            tabsets.openInTabCreateIfNeeded(vm.currentView, data);
        }

        $scope.$on('$destroy', function () {
            //console.log('Destroying tabsCtrl, save tabs ' + vm.tabs);
            //tabsets.setTabset(vm.currentView, vm.tabs);
            tabsets.unInitTabset(vm.currentView);
        })
    }
})();