(function(){
    angular
        .module('gdDoctors')
        .controller('doctors', ['$scope', 'config', 'doctorsProxy',
                               'tableService','loadingCover', '$modal', '$log',
                    Doctors]);

    function Doctors($scope, config, doctorsProxy,
                     tableService, loadingCover, $modal, $log) {
        var vm = this;

        vm.title = 'doctors Ctrl';
        vm.table; // = tableService.init([]);
        vm.showIsLoading = false;
        vm.activate = activate;
        vm.dangerMarkedDocumentId = -1;

        vm.handleOfflineModeChanged = handleOfflineModeChanged;
        vm.handleHoverOverDeleteBtn = handleHoverOverDeleteBtn;
        vm.handleDeleteClick = handleDeleteClick;

        activate();

        //////////////////

        function activate() {
            var currentTab = $scope.vm.getInitiatingTab();
            currentTab.initiated = true;

            vm.table = tableService.init([]);
            fillTable();
        }
        function fillTable(){
            var doctorsRead = doctorsProxy.readAllDoctors();

            if(doctorsRead.$promise){
                //Show, after some time that table is loading.
                loadingCover.changeIsLoading($scope, vm, 'readDoctors', true);

                doctorsRead.$promise.then(function (response) {
                    tableService.updateData(response);
                }).catch(function (response) {
                    var errorMessage = "ERROR getting doctors. " +
                        (response.statusText.length > 0 ?
                        "Server Response: " + response.statusText :
                            "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.changeIsLoading($scope, vm, 'readDoctors', false);
                });

            }else{
                tableService.updateData(doctorsRead);
            }
        }
        //TODO: duplicated, in doctorCtrl
        function showConfirmDelete(data){
            var modalInstance = $modal.open({
                templateUrl: 'modals/confirm_delete.html',
                controller: 'confirmDelete as vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    doctorName: function () {
                        return data.name;
                    }
                }
            });

            modalInstance.result.then(function (modalResult) {
                if(modalResult == 'delete'){
                    handleDeleteClick(undefined, data, true);
                }
            }, function () {
                $log.info('Doctor deletion dismissed.');
            });
        }

        //Event handlers:
        function handleOfflineModeChanged(){
            config.setOfflineMode(vm.offline);
        }
        function handleHoverOverDeleteBtn(id){
            if(vm.dangerMarkedDocumentId){
                vm.dangerMarkedDocumentId = id;
            }
        }
        function handleDeleteClick($event, data){
            //If $event exists function is called from the view, demand confirmation.
            if($event){
                $event.stopPropagation();
                showConfirmDelete(data);

                return;
            }

            var result = doctorsProxy.deleteDoctor(data._id);

            if(result.$promise){
                loadingCover.changeIsLoading($scope, vm, 'deleteDoctor', true);

                result.$promise.then(function () {
                    $scope.vm.closeTabDeletedInList(data);
                    fillTable();
                }).catch(function (response) {
                    var errorMessage = "ERROR deleting doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.changeIsLoading($scope, vm, 'deleteDoctor', false);
                });
            }else{
                fillTable();
            }
        }

        $scope.$on('getAllDoctorsEvent', function () {
            fillTable();
        })
    }
})();
