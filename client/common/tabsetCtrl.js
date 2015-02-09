(function () {
    'use strict';

    app.controller('tabset', ['$scope', '$routeParams', 'tabsets', Tabset]);

    function Tabset($scope, $routeParams, tabsets) {
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

        activate();

        ////////////////

        function activate() {
            currentList = $routeParams.list;

            if(!tabsets.getTabset(currentList)){
                tabsets.initTabset(currentList);
            }
            vm.tabset = tabsets.getTabset(currentList);
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

        //Event Handlers:
        function handleTabSelect(tab){
            if(tab.isFirstTab && vm.reloadNeeded){
                vm.reloadNeeded = false;
                $scope.$broadcast('getAllDoctorsEvent');
            }
        }
        function handleTabCloseClicked(index){
            tabsets.closeTab(currentList, index);
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