(function(){
    angular
        .module('gdPatients')
        .controller('PatientsController', ['$scope', 'config', 'patientsProxy',
            'tableService','loadingCover', '$modal', '$log',
            Patients]);

    function Patients($scope, config, patientsProxy,
                     tableService, loadingCover, $modal, $log) {
        var vm = this;

        vm.title = 'patients Ctrl';
        vm.table; // = tableService.init([]);
        vm.activate = activate;
        vm.dangerMarkedDocumentId = -1;

        vm.handleOfflineModeChanged = handleOfflineModeChanged;
        vm.handleHoverOverDeleteBtn = handleHoverOverDeleteBtn;
        vm.handleDeleteClick = handleDeleteClick;

        activate();

        //////////////////

        function activate() {
            var currentTab = $scope.tabsCtrl.getInitiatingTab();
            currentTab.initiated = true;

            vm.table = tableService.init([]);
            fillTable();
        }
        function fillTable(){
            var patientsRead = patientsProxy.readAllPatients();

            if(patientsRead.$promise){
                //Show, after some time that table is loading.
                loadingCover.showLoadingCover('Getting Patients');

                patientsRead.$promise.then(function (response) {
                    tableService.updateData(response);
                }).catch(function (response) {
                    var errorMessage = "ERROR getting patients. " +
                        (response.statusText.length > 0 ?
                        "Server Response: " + response.statusText :
                            "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });

            }else{
                tableService.updateData(patientsRead);
            }
        }
        //TODO: duplicated, in patientCtrl
        function showConfirmDelete(data, fromList){
            var modalInstance = $modal.open({
                templateUrl: '/modals/confirm_delete.html',
                controller: 'ConfirmDeleteController as confirmDeleteCtrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    contextData: function () {
                        var name = data.firstName ? data.firstName : data.nickName;

                        var contextData = {
                            name: name,
                            type: 'patient'
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
                $log.info('Patient deletion dismissed.');
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
        function handleDeleteClick($event, data, fromList){
            //If $event exists function is called from the view, demand confirmation.
            if($event){
                $event.stopPropagation();
                showConfirmDelete(data, fromList);

                return;
            }

            var result = patientsProxy.deletePatient(data._id);

            if(result.$promise){
                loadingCover.showLoadingCover('Deleting Patient', fromList);

                result.$promise.then(function () {
                    $scope.tabsCtrl.closeTabDeletedInList(data._id);
                    loadingCover.hideLoadingCover();
                    fillTable();    //calls server, thus hide loading cover first.
                }).catch(function (response) {
                    loadingCover.hideLoadingCover();
                    var errorMessage = "ERROR deleting patient. " + response.statusText;
                    window.alert(errorMessage);
                });
            }else{
                fillTable();
            }
        }

        $scope.$on('getAllPatientsEvent', function () {
            fillTable();
        })
    }
})();
