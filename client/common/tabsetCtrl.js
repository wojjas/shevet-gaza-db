(function () {
    'use strict';

    angular
        .module('gdCommon')
        .controller('tabset', ['$scope', '$routeParams', 'tabsets', '$modal', Tabset]);

    function Tabset($scope, $routeParams, tabsets, $modal) {
        var vm = this;

        var tabTemplate = '';
        var currentList = '';

        vm.title = 'Tabset Ctrl tabsets-style';
        vm.tabset = [];
        vm.reloadNeeded = false;

        vm.activate = activate;
        vm.handleTabSelect = handleTabSelect;
        vm.handleTabCloseClicked = handleTabCloseClicked;
        vm.handleTableRowClicked = handleTableRowClicked;

        vm.saveAndOpenInTab = saveAndOpenInTab;
        vm.updateTabHeader = updateTabHeader;
        vm.closeTabDeletedInList = closeTabDeletedInList;
        vm.getInitiatingTab = getInitiatingTab;

        activate();

        ////////////////

        function activate() {
            currentList = $routeParams.list;

            if(!tabsets.getTabset(currentList)){
                tabsets.initTabset(currentList);
            }
            vm.tabset = tabsets.getTabset(currentList);
        }
        function showConfirmClose(currentTab){
            var modalInstance = $modal.open({
                templateUrl: 'modals/handle_unsaved.html',
                controller: 'handleUnsaved as vm',
                backdrop: 'static'
            });

            modalInstance.result.then(function (modalResult) {
                if(modalResult === 'save'){
                    $scope.$broadcast('saveAndCloseEvent', currentTab.id);
                }else{
                    handleTabCloseClicked();
                }
            }, function () {
                console.log('Tab close dismissed.');
            });
        }

        function updateTabHeader(data){
            tabsets.updateTabHeader(currentList, data);
        }
        function saveAndOpenInTab(data){
            tabsets.openInTabCreateIfNeeded(currentList, data);
        }
        function closeTabDeletedInList(data){
            tabsets.closeTabDeletedInList(currentList, data);
        }
        //Returns the first tab found not to be initiated.
        //Call this one from tab's controller's activate/init-functions
        function getInitiatingTab(){
            //Use tabset's memory to track what's initiated and what's not.
            //initiated means, that a tab-controller has used this tab's data/info to fill its form.
            var tabset = vm.tabset;
            for(var i=0, len=tabset.length; i<len; i++){
                if(!tabset[i].initiated){

                    return tabset[i];
                }
            }
        }

        //Event Handlers:
        function handleTabSelect(tab){
            if(tab.isFirstTab && vm.reloadNeeded){
                vm.reloadNeeded = false;
                $scope.$broadcast('getAllDoctorsEvent');
            }
        }
        function handleTabCloseClicked(currentTab){
            console.log('Closing currentTab: ', currentTab);

            //If currentTab is not specified don't try to check if dirty, just close
            var demandConfirmation = currentTab ? true : false;

            //Check for unsaved changes and demand confirmation. Close only when confirmed or noting to be saved.
            if(demandConfirmation && !currentTab.isFirstTab && currentTab.isDirty()){
                showConfirmClose(currentTab);
            }else{
                tabsets.closeTab(currentList);
            }
        }
        function handleTableRowClicked(data){
            tabsets.openInTabCreateIfNeeded(currentList, data);
        }

        $scope.$on('$destroy', function () {
            //console.log('Destroying tabsetCtrl, save tabset ' + vm.tabset);
            //tabsets.setTabset(currentList, vm.tabset);
            tabsets.unInitTabset(currentList);
        })
    }
})();