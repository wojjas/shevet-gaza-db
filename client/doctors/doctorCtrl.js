(function () {
    'use strict';

    app.controller('doctor', Doctor);

    Doctor.$inject = ['$scope', 'doctors'];

    /* @ngInject */
    function Doctor($scope, doctorsProxy) {
        /* jshint validthis: true */
        var vm = this;
        var delayedShowIsLoadingTimer = null;

        vm.isAddNewTab = true;

        //vm.isAddNewDoctor = true;
        vm.title = 'Doctor Ctrl';
        vm.doctor = {};
        vm.activate = activate;
        vm.handleCloseClicked = handleCloseClicked;
        vm.handleSaveClicked = handleSaveClicked;
        vm.handleSaveAndCloseClicked = handleSaveAndCloseClicked;
        vm.handleDeleteClicked = handleDeleteClicked;
        vm.handleClearClicked = handleClearClicked;

        activate();

        ////////////////

        function activate() {
            //Use tabset's memory to track what's initiated and what's not.
            //initiated means, that a doctor-controller has used this tab's info to fill its form.
            var id;
            var tabset = $scope.vm.tabset;
            for(var i=0, len=tabset.length; i<len; i++){
                var tab = tabset[i];
                if(!tab.isFirstTab && !tab.isAddTab && !tab.initiated){
                    tab.initiated = true;
                    id = tab.id;

                    break;
                }
            }
            if(!id){
                vm.doctor = {};
                vm.isAddNewTab = true;

                return;
            }

            //If we failed to get data from tabset we are not editing an existing consequently
            //we will fetch from persistent storage and thus we are NOT in the AddTab.
            vm.isAddNewTab = false;
            var doctorRead = doctorsProxy.readOneDoctor(id);

            if(doctorRead.$promise){
                changeIsLoading(true);

                doctorRead.$promise.then(function (response) {
                    vm.doctor = response;
                }).catch(function (response) {
                    var errorMessage = "ERROR getting doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });
            }else{
                vm.doctor = doctorRead;
                vm.isLoading = false;
            }
        }

        //TODO: move out to shared lib
        //Delays setting of flag that makes View display progress-gif.
        function delayedShowIsLoading(delay){
            return setTimeout(function () {
                vm.showIsLoading = true;
                $scope.$apply();
            }, delay);
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
        //Will update or create depending on current state, edit/add.
        function save(saveAndClose) {
            var actionResult = null;
            $scope.vm.reloadNeeded = true; //Even if save will fail, it won't hurt with a reload

            if(vm.isAddNewTab){
                actionResult = doctorsProxy.createDoctor(vm.doctor);
            }else{
                actionResult = doctorsProxy.updateDoctor(vm.doctor);
            }

            if(actionResult.$promise){
                changeIsLoading(true);

                actionResult.$promise.then(function () {
                    if(saveAndClose){
                        vm.doctor = {}; //Clear this object so a new one can be created next time.
                        $scope.vm.handleTabCloseClicked();
                    }else if(vm.isAddNewTab){
                        $scope.vm.saveAndOpenInTab(vm.doctor);
                        vm.doctor = {};
                    }else{
                        $scope.vm.updateTabHeader(vm.doctor);
                    }
                }).catch(function (response) {
                    var errorMessage = "ERROR saving doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });
            }else{
                if(saveAndClose){
                    vm.doctor = {}; //Clear this object so a new one can be created next time.
                    $scope.vm.handleTabCloseClicked();
                }
            }
        }

        //Event Handlers:
        function handleCloseClicked(){
            //TODO: check if changes have been done,
            // then maybe this should be disabled?
            $scope.vm.handleTabCloseClicked();
        }
        function handleSaveClicked(){
            save(false);
        }
        function handleSaveAndCloseClicked(){
            save(true);
        }
        function handleDeleteClicked(){
            var result = doctorsProxy.deleteDoctor(vm.doctor._id);
            $scope.vm.reloadNeeded = true;

            if(result.$promise){
                changeIsLoading(true);

                result.$promise.then(function () {
                    //$location.path("/doctors");
                    $scope.vm.handleTabCloseClicked();
                }).catch(function (response) {
                    var errorMessage = "ERROR deleting doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });
            }else{
                $scope.vm.handleTabCloseClicked();
            }
        }
        function handleClearClicked(){
            vm.doctor = {};
        }

        $scope.$on('$destroy', function () {
            console.log('Doctor Ctrl is being destroyed for Doctor: ', vm.doctor.name + ", id: " +vm.doctor.id);
        })
    }
})();