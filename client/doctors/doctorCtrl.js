(function () {
    'use strict';

    app.controller('doctor', ['crudButtons', 'doctors', '$location', '$scope', Doctor]);

    function Doctor(crudButtons, doctors, $location, $scope) {
        var vm = this;

        var doctorBkp = null;     //Doctor object backed up to use in case of Cancel
        var isEditing = false;    //if true we are updating an existing document, else crating a new one.
        vm.doctor = {};
        vm.isReadonly = true;

        vm.activate = activate;
        vm.handleFormSubmit = handleFormSubmit;

        activate();

        ////////////////

        function activate() {
            console.log('Doctor controller activated');

            var searchParameter = decodeURI($location.path().substr($location.path().lastIndexOf('/') + 2));
            vm.doctor = doctors.readOneDoctor(searchParameter);
        }

        //TODO: Move this function to some global tool-box:
        function cloneObject(object){
            return JSON.parse(JSON.stringify(object));
        }
        function toggleReadonly() {
            vm.isReadonly = !vm.isReadonly;
        }

//        function isDirty(){
//            var doctorBkpStr = JSON.stringify(doctorBkp);
//            var doctorStr = JSON.stringify(vm.doctor);
//
//            return doctorBkpStr !== "" && doctorBkpStr !== doctorStr;
//        }

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

//        function save() {
//            if(isEditing){
//                doctors.updateDoctor(vm.doctor);
//            }else{
//                toggleReadonly();
//                doctors.createDoctor(vm.doctor);
//            }
//        }

        $scope.$on('saveClickedEvent', function () {
            //toggleReadonly();
            //crudButtons.fireIsDirty();
//            save();
            if(isEditing){
                doctors.updateDoctor(vm.doctor);
            }else{
                toggleReadonly();
                doctors.createDoctor(vm.doctor);
            }
            doctorBkp = cloneObject(vm.doctor);
        })
        $scope.$on('saveAndCloseClickedEvent', function () {
            if(isEditing){
                doctors.updateDoctor(vm.doctor);
            }else{
                toggleReadonly();
                doctors.createDoctor(vm.doctor);
            }
            $location.path("/doctors");
        })

        $scope.$on('deleteClickedEvent', function () {
            toggleReadonly();
            console.log('delete doctor');
            doctors.deleteDoctor(vm.doctor._id);
            $location.path("/doctors");
        })

        function handleFormSubmit(){
            $location.path("/doctors");
        }
    }
})();