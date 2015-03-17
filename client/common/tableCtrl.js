(function(){
    angular
        .module('gdCommon')
        .controller('TableController', ['$scope', 'config', 'rdProxy',
                               'tableService','loadingCover', '$modal', '$log',
                    Table]);

    function Table($scope, config, rdProxy,
                     tableService, loadingCover, $modal, $log) {
        var vm = this;

        vm.title = 'table Ctrl';
        vm.table;
        vm.activate = activate;
        vm.dangerMarkedDocumentId = -1;

        vm.handleOfflineModeChanged = handleOfflineModeChanged;
        vm.handleHoverOverDeleteBtn = handleHoverOverDeleteBtn;
        vm.handleDeleteClick = handleDeleteClick;

        activate();

        //////////////////

        function removeLastChar(str){
            return str.substring(0, str.length - 1);
        }

        function activate() {
            vm.table = tableService.init([]);
            fillTable();
        }
        function fillTable(){
            var documentsRead = rdProxy.readAll(vm.view);

            if(documentsRead.$promise){
                //Show, after some time that table is loading.
                loadingCover.showLoadingCover('Getting ' + vm.view);

                documentsRead.$promise.then(function (response) {
                    tableService.updateData(response);
                }).catch(function (response) {
                    var errorMessage = "ERROR getting documents. " +
                        (response.statusText.length > 0 ?
                        "Server Response: " + response.statusText :
                            "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });

            }else{
                tableService.updateData(documentsRead);
            }
        }
        //TODO: duplicated, in detail-Ctrl
        function showConfirmDelete(data, fromList){
            var modalInstance = $modal.open({
                templateUrl: '/modals/confirm_delete.html',
                controller: 'ConfirmDeleteController as confirmDeleteCtrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    contextData: function () {
                        var contextData = {
                            name: data.name,
                            type: vm.view
                        }
                        return contextData;
                    }
                }
            });

            modalInstance.result.then(function (modalResult) {
                if(modalResult == 'delete'){
                    handleDeleteClick(undefined, data, fromList);
                }
            }, function () {
                $log.info('Document deletion dismissed.');
            });
        }

        //Event handlers:
        function handleOfflineModeChanged(){
            config.setOfflineMode(vm.offline);
        }
        function handleHoverOverDeleteBtn(id){
            vm.dangerMarkedDocumentId = id;
        }
        function handleDeleteClick($event, data, fromList){
            //If $event exists function is called from the view, demand confirmation.
            if($event){
                $event.stopPropagation();
                showConfirmDelete(data, fromList);

                return;
            }

            var result = rdProxy.deleteOne(vm.view, data._id);

            if(result.$promise){
                loadingCover.showLoadingCover('Deleting ' + removeLastChar(vm.view), fromList);

                result.$promise.then(function () {
                    vm.closeTabDeletedInTable({id: data._id});
                    loadingCover.hideLoadingCover();
                    fillTable();    //calls server, thus hide loading cover first.
                }).catch(function (response) {
                    loadingCover.hideLoadingCover();
                    var errorMessage = "ERROR deleting " + removeLastChar(vm.view) +". " + response.statusText;
                    window.alert(errorMessage);
                });
            }else{
                fillTable();
            }
        }

        $scope.$on('reloadTableEvent', function () {
            fillTable();
        })
    }
})();
