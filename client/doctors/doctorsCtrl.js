(function(){
    app.controller('doctors', ['$scope','$location', 'config', 'doctors', 'doctorsTable',
                               Doctors]);

    function Doctors($scope, $location, config, doctors, doctorsTable) {
        var vm = this;

        vm.isLoading = false;
        //vm.table= doctorsTable.createTable([]);
        vm.activate = activate;
        vm.handleRowClicked = handleRowClicked;
        vm.handleOfflineModeChanged = handleOfflineModeChanged;

        activate();

        //////////////////

        function activate() {
            console.log('setting timeout');
            var doctorsRead = doctors.readAllDoctors();

            if(doctorsRead.$promise){
                //Show, after some time that table is loading.
                var timer = delayedIsLoading(1500);

                doctorsRead.$promise.then(function (docs) {
                    vm.table = doctorsTable.createTable(docs);

                    //Data gotten and table rendered, clear the loading indication.
                    clearTimeout(timer);
                    vm.isLoading = false;
                })
            }else{
                vm.table= doctorsTable.createTable(doctorsRead);
            }
        }

        function delayedIsLoading(delay){
            return setTimeout(function () {
                vm.isLoading = true;
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
