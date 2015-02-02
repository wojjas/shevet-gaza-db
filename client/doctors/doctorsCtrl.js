(function(){
    app.controller('doctors', ['$scope','$location', 'config', 'doctors', 'doctorsTable',
                               Doctors]);

    function Doctors($scope, $location, config, doctors, doctorsTable) {
        var vm = this;

        var delayedShowIsLoadingTimer = null;

        vm.title = 'doctors Ctrl';
        //vm.table = doctorsTable.createTable([]);
        vm.isLoading = false;           //Unused yet.
        vm.showIsLoading = false;
        vm.activate = activate;

        vm.handleOfflineModeChanged = handleOfflineModeChanged;

        activate();

        //////////////////

        function activate() {
            //vm.table = doctorsTable.createTable([{},{},{}]);
            fillTable();
        }
        function fillTable(){
            var doctorsRead = doctors.readAllDoctors();

            if(doctorsRead.$promise){
                //Show, after some time that table is loading.
                changeIsLoading(true);

                doctorsRead.$promise.then(function (response) {
                    vm.table = doctorsTable.createTable(response);

                    //doctorsTable.setData(response);
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
                vm.table= doctorsTable.createTable(doctorsRead);
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
            //fillTable();
        })
    }
})();
