(function(){
    app.controller('doctors', ['$scope', 'config', 'doctors',
                               'tableService','loadingCover',
                    Doctors]);

    function Doctors($scope, config, doctors,
                     tableService, loadingCover) {
        var vm = this;

        var delayedShowIsLoadingTimer = null;

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
            vm.table = tableService.init([]);
            fillTable();
        }
        function fillTable(){
            var doctorsRead = doctors.readAllDoctors();

            if(doctorsRead.$promise){
                //Show, after some time that table is loading.
                loadingCover.changeIsLoading($scope, vm, true);

                doctorsRead.$promise.then(function (response) {
                    tableService.updateData(response);
                }).catch(function (response) {
                    var errorMessage = "ERROR getting doctors. " +
                        (response.statusText.length > 0 ?
                        "Server Response: " + response.statusText :
                            "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.changeIsLoading($scope, vm, false);
                });

            }else{
                tableService.updateData(doctorsRead);
            }
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
            console.log('handleDeleteClick');
            $event.stopPropagation();

            var result = doctors.deleteDoctor(data._id);

            //TODO: The whole IsLoading-delayed thing should be in it's own View-Controller
            // When moving it there look out for what I have done here. Here we cancel the
            // delayed IsLoading in then(), this is because fillTable and Delete are using the
            // same global variable: delayedShowIsLoadingTimer. It could be an dictionary of
            // timers, where key should be sent in each call, set and unset, so the correct
            // timer gets cancelled.
            // timer gets cancelled.
            if(result.$promise){
                loadingCover.changeIsLoading($scope, vm, true);

                result.$promise.then(function () {
                    loadingCover.changeIsLoading($scope, vm, false);
                    $scope.vm.closeTabDeletedInList(data)
                    fillTable();
                }).catch(function (response) {
                    var errorMessage = "ERROR deleting doctor. " + response.statusText;
                    window.alert(errorMessage);
                    loadingCover.changeIsLoading($scope, vm, false);
                }).finally(function () {
                    //changeIsLoading(false);
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
