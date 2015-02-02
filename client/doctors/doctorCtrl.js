(function () {
    'use strict';

    app.controller('doctor', Doctor);

    Doctor.$inject = ['$scope', 'doctors'];

    /* @ngInject */
    function Doctor($scope, doctorsProxy) {
        /* jshint validthis: true */
        var vm = this;
        var delayedShowIsLoadingTimer = null;

        var isEditing = false;
        var inAddNewTab = false;

        //vm.isAddNewDoctor = true;
        vm.title = 'Doctor Ctrl';
        vm.doctor = {};
        vm.activate = activate;
        vm.handleCloseClicked = handleCloseClicked;
        vm.handleSaveClicked = handleSaveClicked;
        vm.handleSaveAndCloseClicked = handleSaveAndCloseClicked;
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

                inAddNewTab = true;  //Or some error... :-)
                return;
            }

            var doctorRead = doctorsProxy.readOneDoctor(id);

            if(doctorRead.$promise){
                changeIsLoading(true);

                doctorRead.$promise.then(function (response) {
                    vm.doctor = response;
                    isEditing = true;
                }).catch(function (response) {
                    var errorMessage = "ERROR getting doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });
            }else{
                vm.doctor = doctorRead;
                vm.isLoading = false;
                isEditing = true;
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

            if(isEditing){
                actionResult = doctorsProxy.updateDoctor(vm.doctor);
            }else{
                //toggleReadonly();
                actionResult = doctorsProxy.createDoctor(vm.doctor);
            }

            if(actionResult.$promise){
                changeIsLoading(true);

                actionResult.$promise.then(function () {
                    if(saveAndClose){
                        //$location.path("/doctors");
                        console.debug('TODO: close tab if we are in AddTab!');
                        $scope.vm.closeTab();
                    }
                }).catch(function (response) {
                    var errorMessage = "ERROR saving doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    changeIsLoading(false);
                });
            }else{
                if(saveAndClose){
                    //$location.path("/doctors");
                    console.debug('TODO: close tab if we are in AddTab!');
                    $scope.vm.closeTab();
                }
            }
        }

        //Event Handlers:
        function handleCloseClicked(){
            //TODO: check if changes have been done,
            // then maybe this should be disabled?
            $scope.vm.closeTab();
        }
        function handleSaveClicked(){
            //doctorsProxy.saveDoctor(vm.doctor);
            save(false);

            if(inAddNewTab){
                $scope.vm.saveTab(vm.doctor);
                vm.doctor = {};
            }else{
                $scope.vm.updateTabHeader(vm.doctor);
            }
        }
        function handleSaveAndCloseClicked(){
            //doctorsProxy.saveDoctor(vm.doctor);
            save(true);

            if(inAddNewTab){
                vm.doctor = {}; //Clear this object so a new one can be created next time.
            }
            //Call parent scope's function:
            $scope.vm.handleTabCloseClicked();
        }
        function handleClearClicked(){
            vm.doctor = {};
        }

        $scope.$on('$destroy', function () {
            console.log('Doctor Ctrl is being destroyed for Doctor: ', vm.doctor.name + ", id: " +vm.doctor.id);
        })
    }
})();