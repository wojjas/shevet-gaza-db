(function(){
    app.controller('doctors', ['$location', 'config', 'doctors', 'doctorsTable',
                               Doctors]);

    function Doctors($location, config, doctors, doctorsTable) {
        var vm = this;

        vm.activate = activate;
        vm.handleRowClicked = handleRowClicked;
        vm.handleOfflineModeChanged = handleOfflineModeChanged;

        activate();

        //////////////////

        function activate() {
//            vm.table= doctorsTable.createTable([]);
            var doctorsRead = doctors.readAllDoctors();

            if(doctorsRead.$promise){
                //TODO: show deferred msg that doctors are being fetched from server.
                doctorsRead.$promise.then(function (docs) {
                    vm.table = doctorsTable.createTable(docs);
                })
            }else{
                vm.table= doctorsTable.createTable(doctorsRead);
            }
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
