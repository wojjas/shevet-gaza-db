(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('TabsController', ['$scope', '$routeParams', 'tabset', 'openedTabs', '$modal', Tabs]);

    function Tabs($scope, $routeParams, tabset, openedTabs, $modal) {
        var vm = this;

        var tabset;

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
            console.log('tabsCtrl.view: ' + vm.view);
            vm.currentView = vm.view;

            tabset = new tabset.tabset(vm.currentView);
            //tabset.getTabset().length == 0 && tabset.initTabset(vm.currentView);
            vm.tabs = tabset.getTabset();
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
            tabset.openInTabCreateIfNeeded(vm.currentView, data);
        }
        function closeTabDeletedInTable(id){
            tabset.closeSpecifiedTab(vm.currentView, id);
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
                    tabset.openTab(vm.currentView, 0);
                }else{
                    tabset.closeSpecifiedTab(vm.currentView, currentTab.id);
                }
            }
        }
        function handleTableRowClicked(data){
            tabset.openInTabCreateIfNeeded(vm.currentView, data);
        }

        $scope.$on('$destroy', function () {
            //console.log('Destroying tabsCtrl, save tabs ' + vm.tabs);
            //tabset.setTabset(vm.currentView, vm.tabs);
            //tabset.unInitTabset(vm.currentView);
            openedTabs.setTabset(vm.currentView, vm.tabs);
        })
    }
})();