(function(){
    app.controller('doctors', ['$scope','$location', 'config', 'doctors', 'doctorsTable',
                               Doctors]);

    function Doctors($scope, $location, config, doctors, doctorsTable) {
        var vm = this;

        vm.isLoading = false;           //Unused yet.
        vm.showIsLoading = false;
        //vm.table= doctorsTable.createTable([]);
        vm.activate = activate;
        vm.handleRowClicked = handleRowClicked;
        vm.handleOfflineModeChanged = handleOfflineModeChanged;

        activate();

        //////////////////

        function activate() {
            var doctorsRead = doctors.readAllDoctors();

            if(doctorsRead.$promise){
                //Show, after some time that table is loading.
                changeIsLoading(true);

                doctorsRead.$promise.then(function (response) {
                    vm.table = doctorsTable.createTable(response);
                }).catch(function (response) {
                    //var errorMessage = "ERROR getting doctors. " +
                    //                    response.statusText.length > 0 ?
                    //                    "Server Response: " + response.statusText :
                    //                    "";
                    var errorMessage = "ERROR getting doctors. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });

            }else{
                vm.table= doctorsTable.createTable(doctorsRead);
            }
        }

        function changeIsLoading(isLoading){
            if(isLoading){
                var timer = delayedShowIsLoading(1500);
                vm.isLoading = true;
            }else{
                clearTimeout(timer);
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
        function handleRowClicked(selectedDoctor){
            $location.path("/doctor/:" + selectedDoctor._id);

            //Persist the parameters in service
            doctorsTable.parameters = vm.table.parameters();
        }
        function handleOfflineModeChanged(){
            config.setOfflineMode(vm.offline);
        }
    }
})();
