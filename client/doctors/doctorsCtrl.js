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
                changeIsLoading(true);

                doctorsRead.$promise.then(function (response) {
                    tableService.updateData(response);
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
        function handleHoverOverDeleteBtn(id){
            if(vm.dangerMarkedDocumentId){
                vm.dangerMarkedDocumentId = id;
            }
        }
        function handleDeleteClick($event, id){
            console.log('handleDeleteClick');
            $event.stopPropagation();

            var result = doctors.deleteDoctor(id);

            //TODO: The whole IsLoading-delayed thing should be in it's own View-Controller
            // When moving it there look out for what I have done here. Here we cancel the
            // delayed IsLoading in then(), this is because fillTable and Delete are using the
            // same global variable: delayedShowIsLoadingTimer. It could be an dictionary of
            // timers, where key should be sent in each call, set and unset, so the correct
            // timer gets cancelled.
            // timer gets cancelled.
            if(result.$promise){
                changeIsLoading(true);

                result.$promise.then(function () {
                    changeIsLoading(false);
                    fillTable();
                }).catch(function (response) {
                    var errorMessage = "ERROR deleting doctor. " + response.statusText;
                    window.alert(errorMessage);
                    changeIsLoading(false);
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
