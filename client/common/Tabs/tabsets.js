(function () {
    'use strict';

    angular
        .module('gdCommon')
        .factory('tabsets', tabsets);

    function tabsets() {
        var tabsets = [[]];
        var indexOfTab = indexOfTab;
        var addTabToTabsetAndOpen = addTabToTabsetAndOpen;
        var closeTab = closeTab;

        var service = {
            initTabset: initTabset,
            getTabset: getTabset,
            unInitTabset: unInitTabset,
            openTab: openTab,

            openInTabCreateIfNeeded: openInTabCreateIfNeeded,
            closeActiveTab: closeActiveTab,
            closeSpecifiedTab : closeSpecifiedTab
        };

        return service;

        ////////////////

        //Private Functions:
        function indexOfTab(view, id){
            var currentTabset = tabsets[view]; // vm.tabs;
            for(var i=1, len=currentTabset.length; i < len; i++){
                if(id && currentTabset[i].id === id){
                    return i;
                }
            }
            return -1;
        }
        //This tab's data is considered dirty if its dataBkp differs from its data
        function isDirty(){
            if(this.dataBkp && this.data){
                var dataBkpStr = JSON.stringify(this.dataBkp);
                var dataStr = JSON.stringify(this.data);

                return dataBkpStr !== "" && dataBkpStr !== dataStr;
            }else{
                //if we have no way of saying, we assume it is
                return true;
            }
        }
        function getObjectsName(data){
            var retVal = '[Unknown Name]';

            if(data.name){
                //Objects with "name" have only one field for it
                return data.name;
            }

            //First, Middle, (Nick), Last:
            if(data.firstName){
                retVal = data.firstName;

                if(data.lastName){
                    retVal = retVal + ' ' + data.lastName;
                }else if(data.middleName){
                    retVal = retVal + ' ' + data.middleName;
                }
            }else{
                if(data.middleName){
                    retVal = data.middleName;
                }

                if(data.lastName){
                    retVal = data.middleName ? data.middleName + ' ' + data.lastName :
                            data.lastName;
                }
            }

            return retVal;
        }
        function addTabToTabsetAndOpen(view, data){
            var currentTabset = tabsets[view];

            var newTab = {
                active: true,
                heading: getObjectsName(data),
                id: data._id,

                isDirty: isDirty
            }

            currentTabset.splice(currentTabset.length - 1, 0, newTab);
        }
        function closeTab(view, index){
            var currentTabset = tabsets[view];
            var tabToClose = currentTabset[index];

            if(tabToClose.isAddTab || tabToClose.isFirstTab){
                console.debug('Attempted to close un-closeable tab');

                return;
            }
            currentTabset.splice(index, 1);

            //Always select tab with table, do we really want that!?
            openTab(view, 0);
        }

        //Public Functions:
        function initTabset(view) {
            var currentList = view;
            var tableTabHeading = '';
            var tableTabTemplateURL = '';
            var detailTabTemplateURL = '';

            switch(view){
                case 'doctors':
                    tableTabHeading = 'Doctors';
                    tableTabTemplateURL = 'client/doctors/doctors.html';
                    detailTabTemplateURL = 'client/doctors/doctor.html';
                    break;
                case 'patients':
                    tableTabHeading = 'Patients';
                    tableTabTemplateURL = 'client/patients/patients.html';
                    detailTabTemplateURL = 'client/patients/patient.html';
                    break;
                case 'contacts':
                    tableTabHeading = 'Contacts';
                    tableTabTemplateURL = 'client/contacts/related-contacts-table.html';
                    detailTabTemplateURL = 'client/contacts/contact.html';
                    break;
                case 'relatedContacts':
                    tableTabHeading = 'Contacts Related to Patient';
                    //TODO: use the same as for contacts above?
                    tableTabTemplateURL = 'client/relatedContactsTabs/related-contacts-table.html';
                    detailTabTemplateURL = 'client/contacts/contact.html';
                    break;
                default:
                    tableTabHeading = 'Undefined';
                    tableTabTemplateURL = '';
                    detailTabTemplateURL = '';
                    console.debug('ERROR: Tabset controller called with unhandled view parameter.');
            }

            var tabs = [{
                //Tab used to show view of posts (table)
                "isFirstTab": true,
                "hideCloseIcon": true,
                "heading": tableTabHeading,
                "active": true,
                "template" : tableTabTemplateURL
            },{
                //The tab used for adding a post
                "hideCloseIcon": true,
                "isAddTab": true,
                "heading": 'Add new',
                "active": false,
                "template" : detailTabTemplateURL,

                isDirty: isDirty
            }
            ];

            tabsets[view] = tabs;
        }

        function getTabset(view) {
            return tabsets[view];
        }
        //function setTabset(tabsetName, tabs){
        //    var index = tabsets.indexOf(tabsetName);
        //    tabsets[index] = tabs;
        //}
        function openTab(view, index){
            tabsets[view][index].active = true;
        }

        //Always opens data in tab, if needed after adding tab to tabs.
        function openInTabCreateIfNeeded(view, data){
            var tabOfRequested = indexOfTab(view, data._id);
            if(tabOfRequested === -1){
                addTabToTabsetAndOpen(view, data);
            }else{
                openTab(view, tabOfRequested);
            }
        }
        function unInitTabset(view){
            angular.forEach(tabsets[view], function (tab) {
                tab.initiated = false;
            });
        }
        function closeActiveTab(view){
            var currentTabset = tabsets[view];//vm.tabs;

            //Start at i=1 as we never want to close the FirstTab
            for(var i=1, len=currentTabset.length; i < len; i++){
                if(currentTabset[i].active &&
                   !currentTabset[i].isAddTab &&
                   !currentTabset[i].isFirstTab){
                    currentTabset.splice(i, 1);
                    break;
                }
            }

            //Always select tab with table, do we really want that!?
            openTab(view, 0);
        }
        function closeSpecifiedTab(view, id){
            var index = indexOfTab(view, id);
            if(index !== -1) {
                closeTab(view, index);
            }
        }
    }
})();