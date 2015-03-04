(function () {
    'use strict';

    angular.module('gdDoctors').controller('DoctorController', Doctor);

    Doctor.$inject = ['$scope', '$location', 'doctorsProxy', 'loadingCover', '$modal', '$log'];

    /* @ngInject */
    function Doctor($scope, $location, doctorsProxy, loadingCover, $modal, $log) {
        /* jshint validthis: true */
        var vm = this;
        var currentTab = {};
        var onRouteChangeOff = undefined;

        vm.isAddNewTab = true;
        vm.title = 'Doctor Ctrl';
        vm.doctor = {};
        vm.activate = activate;
        vm.handleCloseClick = handleCloseClick;
        vm.handleSaveClick = handleSaveClick;
        vm.handleSaveAndCloseClick = handleSaveAndCloseClick;
        vm.handleDeleteClick = handleDeleteClick;
        vm.handleClearClick = handleClearClick;

        activate();

        ////////////////

        function activate() {
            var id = undefined;

            //currentTab = $scope.tabsCtrl.getInitiatingTab();
            currentTab = angular.copy(vm.doctorTab);

            if(!currentTab){
                console.debug('Failed to init current tab in Doctor Controller');

                return;
            }
            if(currentTab.isFirstTab){
                return;
            }
            id = currentTab.id;
            //if(!currentTab.isFirstTab && !currentTab.isAddTab){
            //    currentTab.initiated = true;
            //    id = currentTab.id;
            //}

            //We are in addNewTab, creating a new doctor:
            if(!id && currentTab && currentTab.isAddTab){
                setDoctor({});
                vm.isAddNewTab = true;

                return;
            }else{
                vm.isAddNewTab = false;
            }

            //If data exists use it, (don't get from local storage.)
            if(currentTab.data){
                setDoctor(currentTab.data);

                return;
            }

            //We are NOT in the AddTab.
            //If there's no data in tabs for this tab we are not editing an existing
            //consequently we will fetch from persistent storage.
            var doctorRead = doctorsProxy.readOneDoctor(id);

            if(doctorRead.$promise){
                loadingCover.showLoadingCover('Getting Doctor');

                doctorRead.$promise.then(function (response) {
                    setDoctor(response);
                }).catch(function (response) {
                    var errorMessage = "ERROR getting doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                setDoctor(doctorRead);
                vm.isLoading = false;
            }
        }

        //Private functions:
        //TODO: Move this function to some global tool-box:
        function cloneObject(object){
            return JSON.parse(JSON.stringify(object));
        }
        function setDoctor(doctor){
            if(currentTab){
   //             currentTab.data = doctor;
   //             currentTab.dataBkp = cloneObject(doctor);
   //             vm.doctorBkp = doctor
                vm.doctor = angular.copy(doctor);//currentTab.data;
            }
        }
        //Will update or create depending on current state, edit/add.
        function save(saveAndClose, callback) {
            var actionResult = null;
            $scope.tabsCtrl.reloadNeeded = true; //Even if save will fail, it won't hurt with a reload

            if(vm.isAddNewTab){
                actionResult = doctorsProxy.createDoctor(vm.doctor);
            }else{
                actionResult = doctorsProxy.updateDoctor(vm.doctor);
            }

            if(actionResult.$promise){
                loadingCover.showLoadingCover('Saving', saveAndClose);

                actionResult.$promise.then(function () {
                    if(saveAndClose){
                        vm.doctor = {}; //Clear this object so a new one can be created next time.
                        $scope.tabsCtrl.handleTabCloseClicked(currentTab, true);
                    }else if(vm.isAddNewTab){
                        $scope.tabsCtrl.saveAndOpenInTab(vm.doctor);
                        vm.doctor = {};
                    }else{
                        $scope.tabsCtrl.updateTabHeader(vm.doctor);
                    }
                    if(callback){
                        callback();
                    }
                }).catch(function (response) {
                    var errorMessage = "ERROR saving doctor. " + (response ? response.statusText : "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                if(saveAndClose){
                    vm.doctor = {}; //Clear this object so a new one can be created next time.
                    $scope.tabsCtrl.handleTabCloseClicked(currentTab);
                }
            }
        }
        //TODO: duplicated, in doctorsCtrl
        function showConfirmDelete(){
            var modalInstance = $modal.open({
                templateUrl: 'modals/confirm_delete.html',
                controller: 'ConfirmDeleteController as confirmDeleteCtrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    doctorName: function () {
                        return vm.doctor.name;
                    }
                }
            });

            modalInstance.result.then(function (modalResult) {
                if(modalResult == 'delete'){
                    handleDeleteClick(true);
                }
            }, function () {
                $log.info('Doctor deletion dismissed.');
            });
        }
        function showConfirmLeave($event, newUrl){
            //Navigate to newUrl if the form isn't dirty
            //if (!$scope.editForm.$dirty) return;
            if(!currentTab.isDirty()){
                return;
            }

            var modalInstance = $modal.open({
                templateUrl: 'modals/handle_unsaved.html',
                controller: 'HandleUnsavedController as handleUnsavedCtrl',
                backdrop: 'static'
            });

            modalInstance.result.then(function (modalResult) {
                if(modalResult == 'save'){
                    handleSaveClick(function continueRouteChange(){
                        //stop listening for location changes:
                        onRouteChangeOff();
                        //re-fire canceled navigation-request:
                        var urlTmp = newUrl.substr(newUrl.lastIndexOf('/') + 1);
                        $location.path(urlTmp);
                    });
                }
                if(modalResult == 'continue'){
                    //stop listening for location changes:
                    onRouteChangeOff();
                    //re-fire canceled navigation-request:
                    var urlTmp = newUrl.substr(newUrl.lastIndexOf('/') + 1);
                    $location.path(urlTmp);
                }
            }, function () {
                $log.info('Tab leave dismissed.');
            });

            //Takes care of cancel in modal by preventing requested navigation
            //since we will handle it together with modal's promisse
            //(once the user chooses action in modal)
            $event.preventDefault();
        }

        //Event Handlers:
        function handleCloseClick(){
            $scope.tabsCtrl.handleTabCloseClicked(currentTab);
            //vm.doctor = {};
        }
        function handleSaveClick(callback){
            save(false, callback);
            setDoctor(vm.doctor);
        }
        function handleSaveAndCloseClick(){
            save(true);
            setDoctor(vm.doctor);
        }
        function handleDeleteClick(confirmed){
            if(!confirmed){
                 showConfirmDelete();

                return;
            }

            var result = doctorsProxy.deleteDoctor(vm.doctor._id);
            $scope.tabsCtrl.reloadNeeded = true;

            if(result.$promise){
                loadingCover.showLoadingCover('Deleting');

                result.$promise.then(function () {
                    $scope.tabsCtrl.handleTabCloseClicked(currentTab);
                }).catch(function (response) {
                    var errorMessage = "ERROR deleting doctor. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                $scope.tabsCtrl.handleTabCloseClicked(currentTab);
            }
        }
        function handleClearClick(){
            vm.doctor = {};
        }

        $scope.$on('$destroy', function (event) {
            console.log('Doctor Ctrl is being destroyed for Doctor: ', vm.doctor.name + ", id: " +vm.doctor.id);
            console.log('currentTab.isDirty(): ' + currentTab.isDirty());
        })
        onRouteChangeOff = $scope.$on('$locationChangeStart', function($event, newUrl){
            //TODO: maybe better to use tabsCtrl's  $scope.$on('$destroy' for this?
            if(currentTab.isDirty()){
                showConfirmLeave($event, newUrl);
            }
        })
        $scope.$on('saveAndCloseEvent', function (event, concernedTabId) {
            if(currentTab && currentTab.id === concernedTabId){
                handleSaveAndCloseClick();
                //event.stopPropagation();
            }
        })
    }
})();