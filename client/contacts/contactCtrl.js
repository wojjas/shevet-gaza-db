(function () {
    'use strict';

    angular.module('gdContacts').controller('ContactController', Contact);

    Contact.$inject = ['$scope', '$location', 'contactsProxy', 'loadingCover', '$modal', '$log'];

    /* @ngInject */
    function Contact($scope, $location, contactsProxy, loadingCover, $modal, $log) {
        /* jshint validthis: true */
        var vm = this;
        var currentTab = {};                //Reference to parent scope's tab for this controller
        var onRouteChangeOff = undefined;

        vm.isAddNewTab = true;
        vm.title = 'Contact Ctrl';
        vm.contact = {};
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

            currentTab = vm.contactTab;

            if(!currentTab){
                console.debug('Failed to init current tab in Contact Controller');

                return;
            }
            if(currentTab.isFirstTab){
                return;
            }
            id = currentTab.id;

            //We are in addNewTab, creating a new contact:
            if(!id && currentTab.isAddTab){
                setContact({});
                vm.isAddNewTab = true;

                return;
            }else{
                vm.isAddNewTab = false;
            }

            //If data exists use it, (don't get from persistent storage.)
            //SetContact resets the backup object, we don't want to do that
            //(here where we reconsruct the tab with data) if
            //currentTab is considered dirty, because then we will loose that info.
            if(currentTab.data && !currentTab.isDirty()){
                setContact(currentTab.data);

                return;
            }

            //We are NOT in the AddTab.
            //If there's no data in tabs for this tab we are not editing an existing
            //consequently we will fetch from persistent storage.
            var contactRead = contactsProxy.readOneContact(id);

            if(contactRead.$promise){
                loadingCover.showLoadingCover('Getting Contact');

                contactRead.$promise.then(function (response) {
                    setContact(response);
                }).catch(function (response) {
                    var errorMessage = "ERROR getting contact. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                setContact(contactRead);
                vm.isLoading = false;
            }
        }

        //Private functions:
        //TODO: Move this function to some global tool-box:
        function cloneObject(object){
            return JSON.parse(JSON.stringify(object));
        }
        function setContact(contact){
            if(currentTab){
                currentTab.data = contact;
                currentTab.dataBkp = angular.copy(contact); //cloneObject(contact);
                vm.contact = currentTab.data;

                //Handle contacts table:
                vm.contactDataTable = angular.copy(vm.contact.contactData);
                if(!vm.contactDataTable){
                    vm.contactDataTable = [];
                }
                vm.contactDataTable.push({});
            }
        }
        //Will update or create depending on current state, edit/add.
        function save(saveAndClose, callback) {
            var actionResult = null;
            vm.reloadTableNeeded = true; //Even if save will fail, it won't hurt with a reload

            if(currentTab.isAddTab){
                actionResult = contactsProxy.createContact(vm.contact);
            }else{
                actionResult = contactsProxy.updateContact(vm.contact);
            }

            if(actionResult.$promise){
                loadingCover.showLoadingCover('Saving', saveAndClose);

                actionResult.$promise.then(function () {
                    if(saveAndClose){
                        vm.contact = {}; //Clear this object so a new one can be created next time.
                        vm.handleTabCloseClicked({doNotConfirm: true});
                    }else if(currentTab.isAddTab){
                        vm.saveAndOpenInTab({data: vm.contact});
                        vm.contact = {};
                    }else{
                        vm.contactTab.heading = vm.contact.name;
                    }
                    if(callback){
                        callback();
                    }
                }).catch(function (response) {
                    var errorMessage = "ERROR saving contact. " + (response ? response.statusText : "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                if(saveAndClose){
                    vm.contact = {}; //Clear this object so a new one can be created next time.
                    vm.handleTabCloseClicked();
                }
            }
        }
        //TODO: duplicated, in contactsCtrl
        function showConfirmDelete(){
            var modalInstance = $modal.open({
                templateUrl: '/modals/confirm_delete.html',
                controller: 'ConfirmDeleteController as confirmDeleteCtrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    contextData: function () {
                        var contextData = {
                            name: vm.contact.name,
                            type: 'contact'
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
                $log.info('Contact deletion dismissed.');
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
        function handleCloseClick(){
            vm.handleTabCloseClicked();
            //vm.contact = {};
        }
        function handleSaveClick(callback){
            save(false, callback);
            setContact(vm.contact);
        }
        function handleSaveAndCloseClick(){
            save(true);
            setContact(vm.contact);
        }
        function handleDeleteClick(confirmed){
            if(!confirmed){
                 showConfirmDelete();

                return;
            }

            var result = contactsProxy.deleteContact(vm.contact._id);
            vm.reloadTableNeeded = true;

            if(result.$promise){
                loadingCover.showLoadingCover('Deleting');

                result.$promise.then(function () {
                    vm.handleTabCloseClicked();
                }).catch(function (response) {
                    var errorMessage = "ERROR deleting contact. " + response.statusText;
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });
            }else{
                vm.handleTabCloseClicked();
            }
        }
        function handleClearClick(){
            vm.contact = {};
        }

        $scope.$on('$destroy', function (event) {
            console.log('Contact Ctrl is being destroyed for Contact: ', vm.contact.name + ", id: " +vm.contact._id);
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