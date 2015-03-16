(function(){
    angular
        .module('gdContacts')
        .controller('ContactsController', ['$scope', 'config', 'contactsProxy',
                               'tableService','loadingCover', '$modal', '$log',
                    Contacts]);

    function Contacts($scope, config, contactsProxy,
                     tableService, loadingCover, $modal, $log) {
        var vm = this;

        vm.title = 'contacts Ctrl';
        vm.table; // = tableService.init([]);
        vm.activate = activate;
        vm.dangerMarkedDocumentId = -1;

        vm.handleOfflineModeChanged = handleOfflineModeChanged;
        vm.handleHoverOverDeleteBtn = handleHoverOverDeleteBtn;
        vm.handleDeleteClick = handleDeleteClick;

        activate();

        //////////////////

        function activate() {
            var currentTab = $scope.tabsCtrl.getInitiatingTab();
            currentTab.initiated = true;    //TODO: remove as the whole initiated-stuff is depricated since use of directives

            vm.table = tableService.init([]);
            fillTable();
        }
        function fillTable(){
            var contactsRead = contactsProxy.readAllContacts();

            if(contactsRead.$promise){
                //Show, after some time that table is loading.
                loadingCover.showLoadingCover('Getting Contacts');

                contactsRead.$promise.then(function (response) {
                    tableService.updateData(response);
                }).catch(function (response) {
                    var errorMessage = "ERROR getting contacts. " +
                        (response.statusText.length > 0 ?
                        "Server Response: " + response.statusText :
                            "");
                    window.alert(errorMessage);
                }).finally(function () {
                    loadingCover.hideLoadingCover();
                });

            }else{
                tableService.updateData(contactsRead);
            }
        }
        //TODO: duplicated, in contactCtrl
        function showConfirmDelete(data, fromList){
            var modalInstance = $modal.open({
                templateUrl: '/modals/confirm_delete.html',
                controller: 'ConfirmDeleteController as confirmDeleteCtrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    contextData: function () {
                        var contextData = {
                            name: data.name,
                            type: 'contact'
                        }
                        return contextData;
                    }
                }
            });

            modalInstance.result.then(function (modalResult) {
                if(modalResult == 'delete'){
                    handleDeleteClick(undefined, data, fromList);
                }
            }, function () {
                $log.info('Contact deletion dismissed.');
            });
        }

        //Event handlers:
        function handleOfflineModeChanged(){
            config.setOfflineMode(vm.offline);
        }
        function handleHoverOverDeleteBtn(id){
            vm.dangerMarkedDocumentId = id;
        }
        function handleDeleteClick($event, data, fromList){
            //If $event exists function is called from the view, demand confirmation.
            if($event){
                $event.stopPropagation();
                showConfirmDelete(data, fromList);

                return;
            }

            var result = contactsProxy.deleteContact(data._id);

            if(result.$promise){
                loadingCover.showLoadingCover('Deleting Contact', fromList);

                result.$promise.then(function () {
                    $scope.tabsCtrl.closeTabDeletedInTable(data._id);
                    loadingCover.hideLoadingCover();
                    fillTable();    //calls server, thus hide loading cover first.
                }).catch(function (response) {
                    loadingCover.hideLoadingCover();
                    var errorMessage = "ERROR deleting contact. " + response.statusText;
                    window.alert(errorMessage);
                });
            }else{
                fillTable();
            }
        }

        $scope.$on('reloadTableEvent', function () {
            fillTable();
        })
    }
})();
