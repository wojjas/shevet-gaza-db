(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('TabsController', ['$scope', '$routeParams', 'tabsets', '$modal', Tabs]);

    function Tabs($scope, $routeParams, tabsets, $modal) {
        var vm = this;

        var tabTemplate = '';

        vm.title = 'Tabs Ctrl';
        vm.currentList = '';
        vm.tabs = [];
        vm.reloadTableNeeded = false;  //Reload of first-tab, the table, is needed

        vm.activate = activate;
        vm.handleTabSelect = handleTabSelect;
        vm.handleTabCloseClicked = handleTabCloseClicked;
        vm.handleTableRowClicked = handleTableRowClicked;

        vm.saveAndOpenInTab = saveAndOpenInTab;
        vm.closeTabDeletedInList = closeTabDeletedInList;
        vm.getInitiatingTab = getInitiatingTab;

        activate();

        ////////////////

        function activate() {
            console.log('tabsCtrl: ' + vm.view);
            vm.currentList = vm.view; //$routeParams.list;

            if(!tabsets.getTabset(vm.currentList)){
                tabsets.initTabset(vm.currentList);
            }
            vm.tabs = tabsets.getTabset(vm.currentList);
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
            tabsets.openInTabCreateIfNeeded(vm.currentList, data);
        }
        function closeTabDeletedInList(id){
            tabsets.closeSpecifiedTab(vm.currentList, id);
        }
        //Returns the first tab found not to be initiated.
        //Call this one from tab's controller's activate/init-functions
        function getInitiatingTab(){
            //Use tabs's memory to track what's initiated and what's not.
            //initiated means, that a tab-controller has used this tab's data/info to fill its form.
            var tabset = vm.tabs;
            for(var i=0, len=tabset.length; i<len; i++){
                if(!tabset[i].initiated){

                    return tabset[i];
                }
            }
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
                    tabsets.openTab(vm.currentList, 0);
                }else{
                    tabsets.closeSpecifiedTab(vm.currentList, currentTab.id);
                }
            }
        }
        function handleTableRowClicked(data){
            tabsets.openInTabCreateIfNeeded(vm.currentList, data);
        }

        $scope.$on('$destroy', function () {
            //console.log('Destroying tabsCtrl, save tabs ' + vm.tabs);
            //tabsets.setTabset(vm.currentList, vm.tabs);
            tabsets.unInitTabset(vm.currentList);
        })
    }
})();