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
            //consequently we will fetch from persistent storage or already gotten Patient document.
            //From already gotten Patient document if vm.relatedContacts exists, if it does it means this controller is
            //part of a directive inside the patient-detail-page. Else it's a part of a directive in the contact-detail-page
            if(vm.relatedContacts){
                readOneRelatedContactFromPatient(id);
            }else {
                readOneContactFromPersistentStorage(id);
            }
        }

        //Private functions:
        function readOneRelatedContactFromPatient(id){
            for(var i = 0, len = vm.relatedContacts.length; i < len; i++){
                var relatedContact = vm.relatedContacts[i];
                if (relatedContact.contact._id === id){
                    setContact(relatedContact.contact);

                    return;
                }
            }
        }
        function readOneContactFromPersistentStorage(id){
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
        function isLastContactNumberDummy(contact){
            return contact && contact.contactNumbers && contact.contactNumbers.length > 0 &&
                (!contact.contactNumbers[contact.contactNumbers.length - 1].description &&
                !contact.contactNumbers[contact.contactNumbers.length - 1].number);
        }
        //Add a dummy-contact-number as the last contact-number
        //Only add if a dummy isn't there yet. Only remove if the last one is a dummy.
        function addOrRemoveDummyContactNumber(contact, add){
            //add
            if(add && !isLastContactNumberDummy(contact)){
                vm.contactNumbers.push({});
            }
            //remove
            if(!add && isLastContactNumberDummy(contact)){
                contact.contactNumbers.pop();
            }
        }
        function setContact(contact){
            if(currentTab){
                //Init contact numbers table:
                contact.contactNumbers = contact.contactNumbers || []; //in case of AddNew
                vm.contactNumbers = contact.contactNumbers;
                addOrRemoveDummyContactNumber(contact, true);

                currentTab.data = contact;
                currentTab.dataBkp = angular.copy(contact);
                vm.contact = currentTab.data;
            }
        }
        //Will update or create depending on current state, edit/add.
        function save(saveAndClose, callback) {
            var actionResult = null;
            vm.reloadTableNeeded = true; //Even if save will fail, it won't hurt with a reload

            //Remove last empty object from contac-numbers! (sometimes added by this ctrl)
            addOrRemoveDummyContactNumber(vm.contact, false);

            //Remove "relation" added (by this ctrl) to the contact object
            delete vm.contact.relation; //TODO: test.

            if(currentTab.isAddTab){
                actionResult = contactsProxy.createContact(vm.contact);
            }else{
                actionResult = contactsProxy.updateContact(vm.contact);
            }

            if(actionResult.$promise){
                loadingCover.showLoadingCover('Saving', saveAndClose);

                actionResult.$promise.then(function () {
                    if(saveAndClose){
                        vm.handleTabCloseClicked({doNotConfirm: true});
                        setContact({}); //Clear this object for AddNew tab's form
                    }else if(currentTab.isAddTab){
                        vm.saveAndOpenInTab({data: vm.contact});
                        setContact({}); //Clear this object for AddNew tab's form
                    }else{
                        vm.contactTab.heading = vm.contact.name;
                        setContact(vm.contact);
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
        }
        function handleSaveAndCloseClick(){
            save(true);
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
            var isNotRelatedContactTabs = !vm.relatedContacts;
            if(isNotRelatedContactTabs && !currentTab.isFirstTab && currentTab.isDirty()){
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