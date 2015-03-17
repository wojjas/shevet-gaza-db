(function () {
    'use strict';

    angular.module('gdPatients').controller('PatientController', Patient);

    Patient.$inject = ['$scope', '$location', 'patientsProxy', 'loadingCover', '$modal', '$log'];

    /* @ngInject */
    function Patient($scope, $location, patientsProxy, loadingCover, $modal, $log) {
        /* jshint validthis: true */
        var vm = this;
        var currentTab = {};                //Reference to parent scope's tab for this controller
        var onRouteChangeOff = undefined;

        vm.isAddNewTab = true;
        vm.title = 'Patient Ctrl';
        vm.patient = {};
        vm.activate = activate;
        vm.handleGenderSelected = handleGenderSelected;
        vm.handleReligionSelected = handleReligionSelected;
        vm.handleCloseClick = handleCloseClick;
        vm.handleSaveClick = handleSaveClick;
        vm.handleSaveAndCloseClick = handleSaveAndCloseClick;
        vm.handleDeleteClick = handleDeleteClick;
        vm.handleClearClick = handleClearClick;

        activate();

        ////////////////

        function activate() {
            var id = undefined;

            currentTab = vm.patientTab;

            if(!currentTab){
                console.debug('Failed to init current tab in Patient Controller');

                return;
            }
            if(currentTab.isFirstTab){
                return;
            }
            id = currentTab.id;

            //We are in addNewTab, creating a new patient:
            if(!id && currentTab.isAddTab){
                setPatient({});
                vm.isAddNewTab = true;

                return;
            }else{
                vm.isAddNewTab = false;
            }

            //If data exists use it, (don't get from persistent storage.)
            //SetPatient resets the backup object, we don't want to do that
            //(here where we reconsruct the tab with data) if
            //currentTab is considered dirty, because then we will loose that info.
            if(currentTab.data && !currentTab.isDirty()){
                setPatient(currentTab.data);

                return;
            }

            //We are NOT in the AddTab.
            //If there's no data in tabs for this tab we are not editing an existing
            //consequently we will fetch from persistent storage.
            var patientRead = patientsProxy.readOnePatient(id);

            if(patientRead.$promise){
                loadingCover.showLoadingCover('Getting Patient');

                patientRead.$promise.then(function (response) {
                    setPatient(response);
                }).catch(function (response) {
                    var errorMessage = "ERROR getting patient. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                setPatient(patientRead);
                vm.isLoading = false;
            }
        }

        //Private functions:
        //TODO: Move this function to some global tool-box:
        function cloneObject(object){
            return JSON.parse(JSON.stringify(object));
        }
        function setPatient(patient){
            if(currentTab){
                currentTab.data = patient;
                currentTab.dataBkp = angular.copy(patient); //cloneObject(patient);
                vm.patient = currentTab.data;

                //Handle drop-downs:
                vm.genders = [{
                    label:'Unknown', value:'unknown'},{
                    label:'Female', value:'female'},{
                    label:'Male', value:'male'
                }];
                vm.selectedGender = vm.patient.gender && vm.patient.gender !== "" ?
                                    vm.patient.gender :
                                    vm.genders[0].value;

                vm.religions = [{
                    label:'Other', value:'Other'},{
                    label:'Muslim', value:'Muslim'},{
                    label:'Christian', value:'Christian'
                }];
                vm.selectedReligion = vm.patient.religion && (vm.patient.religion === 'Christian' ||  vm.patient.religion === 'Muslim') ?
                                    vm.patient.religion :
                                    vm.religions[0].value;
            }
        }
        //Will update or create depending on current state, edit/add.
        function save(saveAndClose, callback) {
            var actionResult = null;
            vm.reloadTableNeeded = true; //Even if save will fail, it won't hurt with a reload

            if(currentTab.isAddTab){
                actionResult = patientsProxy.createPatient(vm.patient);
            }else{
                actionResult = patientsProxy.updatePatient(vm.patient);
            }

            if(actionResult.$promise){
                loadingCover.showLoadingCover('Saving', saveAndClose);

                actionResult.$promise.then(function () {
                    if(saveAndClose){
                        vm.patient = {}; //Clear this object so a new one can be created next time.
                        vm.handleTabCloseClicked({doNotConfirm: true});
                    }else if(currentTab.isAddTab){
                        vm.saveAndOpenInTab({data: vm.patient});
                        vm.patient = {};
                    }else{
                        vm.patientTab.heading = vm.patient.firstName;
                    }
                    if(callback){
                        callback();
                    }
                }).catch(function (response) {
                    var errorMessage = "ERROR saving patient. " + (response ? response.statusText : "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                if(saveAndClose){
                    vm.patient = {}; //Clear this object so a new one can be created next time.
                    vm.handleTabCloseClicked();
                }
            }
        }
        //TODO: duplicated, in patientsCtrl
        function showConfirmDelete(){
            var modalInstance = $modal.open({
                templateUrl: '/modals/confirm_delete.html',
                controller: 'ConfirmDeleteController as confirmDeleteCtrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    contextData: function () {
                        var contextData = {
                            name: vm.patient.firstName,
                            type: 'patient'
                        }
                        return contextData;
                    }
                }
            });

            modalInstance.result.then(function (modalResult) {
                if(modalResult == 'delete'){
                    handleDeleteClick(true);
                }
            }, function () {
                $log.info('Patient deletion dismissed.');
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
                        var urlToGoTo = newUrl.substring(newUrl.lastIndexOf('#')+2, newUrl.length);
                        $location.path(urlToGoTo);
                    });
                }
                if(modalResult == 'continue'){
                    //stop listening for location changes:
                    onRouteChangeOff();
                    //re-fire canceled navigation-request:
                    var urlToGoTo = newUrl.substring(newUrl.lastIndexOf('#')+2, newUrl.length);
                    $location.path(urlToGoTo);
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
        function handleGenderSelected(){
            vm.patient.gender = vm.selectedGender;
        }
        function handleReligionSelected(){
            vm.patient.religion = vm.selectedReligion;
        }
        function handleCloseClick(){
            vm.handleTabCloseClicked();
            //vm.patient = {};
        }
        function handleSaveClick(callback){
            save(false, callback);
            setPatient(vm.patient);
        }
        function handleSaveAndCloseClick(){
            save(true);
            setPatient(vm.patient);
        }
        function handleDeleteClick(confirmed){
            if(!confirmed){
                 showConfirmDelete();

                return;
            }

            var result = patientsProxy.deletePatient(vm.patient._id);
            vm.reloadTableNeeded = true;

            if(result.$promise){
                loadingCover.showLoadingCover('Deleting');

                result.$promise.then(function () {
                    vm.handleTabCloseClicked();
                }).catch(function (response) {
                    var errorMessage = "ERROR deleting patient. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                vm.handleTabCloseClicked();
            }
        }
        function handleClearClick(){
            vm.patient = {};
        }

        $scope.$on('$destroy', function (event) {
            console.log('Patient Ctrl is being destroyed for Patient: ', vm.patient.firstName + ", id: " +vm.patient._id);
        })
        onRouteChangeOff = $scope.$on('$locationChangeStart', function($event, newUrl){
            //TODO: maybe better to use tabsCtrl's  $scope.$on('$destroy' for this?
            if(!currentTab.isFirstTab && currentTab.isDirty()){
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