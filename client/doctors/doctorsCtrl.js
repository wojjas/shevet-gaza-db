(function(){
    app.controller('doctors', ['$scope','$location', 'config', 'doctors', 'tableService',
                               Doctors]);

    function Doctors($scope, $location, config, doctors, tableService) {
        var vm = this;

        var delayedShowIsLoadingTimer = null;

        vm.title = 'doctors Ctrl';
        vm.table; // = tableService.init([]);
        vm.isLoading = false;           //Unused yet.
        vm.showIsLoading = false;
        vm.activate = activate;

        vm.handleOfflineModeChanged = handleOfflineModeChanged;

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
                changeIsLoading(true);

                doctorsRead.$promise.then(function (response) {
                    tableService.updateData(response);
                    //vm.table.reload();
                }).catch(function (response) {
                    var errorMessage = "ERROR getting doctors. " +
                        (response.statusText.length > 0 ?
                        "Server Response: " + response.statusText :
                            "");
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });

            }else{
                tableService.updateData(doctorsRead);
                //vm.table.read();
            }
        }

        function changeIsLoading(isLoading){
            if(isLoading){
                delayedShowIsLoadingTimer = delayedShowIsLoading(1500);
                vm.isLoading = true;
            }else{
                clearTimeout(delayedShowIsLoadingTimer);
                vm.isLoading = false;
                vm.showIsLoading = false;
            }
        }

        //TODO: Duplicated
        //Delays setting of flag that makes View display progress-gif.
        function delayedShowIsLoading(delay){
            return setTimeout(function () {
                vm.showIsLoading = true;
                $scope.$apply();
            }, delay);
        }

        //Event handlers:
        function handleOfflineModeChanged(){
            config.setOfflineMode(vm.offline);
        }

        $scope.$on('getAllDoctorsEvent', function () {
            fillTable();
        })
    }
})();
