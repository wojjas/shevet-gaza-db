(function () {
    'use strict';

    app.controller('doctor', ['crudButtons', 'doctors', '$location', '$scope', Doctor]);

    function Doctor(crudButtons, doctors, $location, $scope) {
        var vm = this;

        var doctorBkp = null;     //Doctor object backed up to use in case of Cancel
        var isEditing = false;    //if true we are updating an existing document, else crating a new one.
        vm.doctor = {};

        vm.isReadonly = true;      //Governs input-fields.
        vm.isLoading = true;       //Disables buttons, etc.
        vm.showIsLoading = false;  //Big visual impact with progress-gif.

        vm.activate = activate;
        vm.handleFormSubmit = handleFormSubmit;

        activate();

        ////////////////

        function activate() {
            console.log('Doctor controller activated');

            var searchParameter = decodeURI($location.path().substr($location.path().lastIndexOf('/') + 2));
            var doctorRead = doctors.readOneDoctor(searchParameter);

            if(doctorRead.$promise){
                changeIsLoading(true);

                //TODO: Server-Error-handling
                doctorRead.$promise.then(function (doc) {
                    vm.doctor = doc;
                    changeIsLoading(false);
                })
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
                var timer = delayedShowIsLoading(1500);
                vm.isLoading = true;
            }else{
                clearTimeout(timer);
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
        })
        $scope.$watch('vm.doctor.cellPhone', function(){
            crudButtons.fireIsDirty();
        })
        $scope.$watch('vm.doctor.officePhone', function(){
            crudButtons.fireIsDirty();
        })
        $scope.$watch('vm.doctor.officeFax', function(){
            crudButtons.fireIsDirty();
        })
        $scope.$watch('vm.doctor.homePhone', function(){
            crudButtons.fireIsDirty();
        })
        $scope.$watch('vm.doctor.email', function(){
            crudButtons.fireIsDirty();
        })

        $scope.$on('editClickedEvent', function () {
            toggleReadonly();
            isEditing = true;
            doctorBkp = cloneObject(vm.doctor);
        })

        $scope.$on('addClickedEvent', function () {
            toggleReadonly();
            isEditing = false;
            doctorBkp = cloneObject(vm.doctor);
            vm.doctor = {};
        })
        $scope.$on('cancelClickedEvent', function () {
            toggleReadonly();
            vm.doctor = doctorBkp;
        })

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
                    changeIsLoading(false);

                    if(saveAndClose){
                        $location.path("/doctors");
                    }
                })
            }else{
                if(saveAndClose){
                    $location.path("/doctors");
                }
            }
        }
        $scope.$on('saveClickedEvent', function () {
            save();
            doctorBkp = cloneObject(vm.doctor);
        })
        $scope.$on('saveAndCloseClickedEvent', function () {
            save(true);
        })

        $scope.$on('deleteClickedEvent', function () {
            toggleReadonly();
            console.log('delete doctor');

            var result = doctors.deleteDoctor(vm.doctor._id);

            if(result.$promise){
                changeIsLoading(true);

                result.$promise.then(function () {
                    changeIsLoading(false);
                    $location.path("/doctors");
                })
            }else{
                $location.path("/doctors");
            }
        })

        function handleFormSubmit(){
            $location.path("/doctors");
        }
    }
})();