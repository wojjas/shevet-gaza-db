(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('TabsController', ['$scope', 'tabset', 'openedTabs', '$modal', Tabs]);

    function Tabs($scope, tabsetService, openedTabs, $modal) {
        var vm = this;

        var tabset;                     //Instance of tabsetService

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
        vm.selectFirstTab = selectFirstTab;

        activate();

        ////////////////

        function activate() {
            console.log('tabsCtrl.view: ' + vm.view);
            vm.currentView = vm.view;
            tabset = new tabsetService.tabset();
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
            tabset.openInTabCreateIfNeeded(data);
        }
        function closeTabDeletedInTable(id){
            tabset.closeSpecifiedTab(id);
        }
        function selectFirstTab(){
            tabset.openTab(0);
        }

        //Event Handlers:
        function handleTabSelect(tab){
            if(tab.isFirstTab && vm.reloadTableNeeded){
                vm.reloadTableNeeded = false;
                $scope.$broadcast('reloadTableEvent', vm.currentView.indexOf('relatedContacts') >= 0);
            }
        }
        function handleTabCloseClicked(currentTab, doNotConfirm) {
            //Check for unsaved changes and demand confirmation. RelatedContacts excluded since inside Patient.
            var isNotRelatedContactTabs = vm.currentView.indexOf('relatedContacts') === -1;
            if (isNotRelatedContactTabs && !doNotConfirm && (currentTab && !currentTab.isFirstTab && currentTab.isDirty())) {
                showConfirmClose(currentTab);
            } else {
                if (currentTab.isAddTab) {
                    tabset.openTab(0);
                } else {
                    //If closing Patient, remove related contact's tabset as well
                    if(vm.currentView === 'patients'){
                        var tabsetId = 'relatedContacts_' + currentTab.id;
                        openedTabs.removeTabset(tabsetId);
                        tabsetService.updateTabset = false;
                    }
                    tabset.closeSpecifiedTab(currentTab.id);
                }
            }
        }
        function handleTableRowClicked(data){
            tabset.openInTabCreateIfNeeded(data);
        }

        $scope.$on('$destroy', function () {
            if(tabsetService.updateTabset){
                tabset.updateTabset();
            }else{
                tabsetService.updateTabset = true;
            }
        })

        //The tabset, instantiated in activate(), is initiated here, after the view is set
        //because some view's names are built using an id-part unknown at creation of this ctrl.
        $scope.$watch(function(){
            return vm.view;
        }, function(){
            var tmp = vm.view.split('_');

            //No id part:
            if(tmp.length === 1) {
                vm.currentView = vm.view;
                tabset.initTabset(vm.view);
                vm.tabs = tabset.getTabset();
            }
            //Related contacts with undefined id-part => addNew-tab:
            if(tmp[1] === 'undefined'){
                return; //TODO: handle this in some smart way.
            }
            //Related contacts with valid patient-id:
            if(tmp[0] === "relatedContacts" && tmp[1] !== 'undefined'){
                vm.currentView = vm.view;
                tabset.initTabset(vm.view);
                vm.tabs = tabset.getTabset();
            }
        });
    }
})();