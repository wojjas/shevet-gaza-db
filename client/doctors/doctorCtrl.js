(function () {
    'use strict';

    app.controller('doctor', ['crudButtons', 'doctors', '$location', '$scope', Doctor]);

    function Doctor(crudButtons, doctors, $location, $scope) {
        var vm = this;

        var delayedShowIsLoadingTimer = null;
        var doctorBkp = null;     //Doctor object backed up to use in case of Cancel
        var isEditing = false;    //if true we are updating an existing document, else crating a new one.
        vm.doctor = {};

        vm.isReadonly = true;      //Governs input-fields.
        vm.isLoading = false;      //Disables buttons, etc.
        vm.showIsLoading = false;  //Big visual impact with progress-gif.

        vm.activate = activate;
        vm.handleFormSubmit = handleFormSubmit;

        activate();

        ////////////////

        function activate() {
            //var searchParameter = decodeURI($location.path().substr($location.path().lastIndexOf('/') + 2));
            //var allTabs = $scope.vm.tabset;
            //var currentTab = allTabs[allTabs.length - 2];
            //
            //if(currentTab.isFirstTab || currentTab.isAddTab){
            //    var logMsg = 'Doctor Ctrl Activated for: ' + (currentTab.isFirstTab ? 'FirstTab' : 'AddTab');
            //    console.log(logMsg);
            //
            //    return;
            //}
            //console.log('Doctor Ctrl Activated for doctor: ' + currentTab.heading + " with id: " + currentTab.id);

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

                return;
            }

            var doctorRead = doctors.readOneDoctor(id);

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

        //TODO: Move this function to some global tool-box:
        function cloneObject(object){
            return JSON.parse(JSON.stringify(object));
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
        function toggleReadonly() {
            vm.isReadonly = !vm.isReadonly;
        }

        $scope.$watch('vm.isLoading', function () {
            crudButtons.fireLock(vm.isLoading);
        });

        //Watches for isDirty, another solution is to use ng-change on each input in the view.
        $scope.$watch('vm.doctor.name', function(){
            crudButtons.fireIsDirty();
        });
        $scope.$watch('vm.doctor.cellPhone', function(){
            crudButtons.fireIsDirty();
        });
        $scope.$watch('vm.doctor.officePhone', function(){
            crudButtons.fireIsDirty();
        });
        $scope.$watch('vm.doctor.officeFax', function(){
            crudButtons.fireIsDirty();
        });
        $scope.$watch('vm.doctor.homePhone', function(){
            crudButtons.fireIsDirty();
        });
        $scope.$watch('vm.doctor.email', function(){
            crudButtons.fireIsDirty();
        });

        $scope.$on('editClickedEvent', function () {
            toggleReadonly();
            isEditing = true;
            doctorBkp = cloneObject(vm.doctor);
        });

        $scope.$on('addClickedEvent', function () {
            toggleReadonly();
            isEditing = false;
            doctorBkp = cloneObject(vm.doctor);
            vm.doctor = {};
        });
        $scope.$on('cancelClickedEvent', function () {
            toggleReadonly();
            vm.doctor = doctorBkp;
        });

        //TODO: Server-Error-handling
        //Will update or create depending on current state, edit/add.
        function save(saveAndClose) {
            var actionResult = null;

            if(isEditing){
                actionResult = doctors.updateDoctor(vm.doctor);
            }else{
                toggleReadonly();
                actionResult = doctors.createDoctor(vm.doctor);
            }

            if(actionResult.$promise){
                changeIsLoading(true);

                actionResult.$promise.then(function () {
                    if(saveAndClose){
                        $location.path("/doctors");
                    }
                }).catch(function (response) {
                    var errorMessage = "ERROR saving doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });
            }else{
                if(saveAndClose){
                    $location.path("/doctors");
                }
            }
        }
        $scope.$on('saveClickedEvent', function () {
            save();
            doctorBkp = cloneObject(vm.doctor);
        });
        $scope.$on('saveAndCloseClickedEvent', function () {
            save(true);
        });

        $scope.$on('deleteClickedEvent', function () {
            var result = doctors.deleteDoctor(vm.doctor._id);

            if(result.$promise){
                changeIsLoading(true);

                result.$promise.then(function () {
                    $location.path("/doctors");
                }).catch(function (response) {
                    var errorMessage = "ERROR deleting doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });
            }else{
                $location.path("/doctors");
            }
        });

        function handleFormSubmit(){
            $location.path("/doctors");
        }
    }
})();