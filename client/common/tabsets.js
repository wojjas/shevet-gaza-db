(function () {
    'use strict';

    //app.factory('tabsets', tabsets);
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
            closeSpecifiedTab : closeSpecifiedTab,
            updateTabHeader: updateTabHeader
        };

        return service;

        ////////////////

        //Private Functions:
        function indexOfTab(tabset, id){
            var currentTabset = tabsets[tabset]; // vm.tabs;
            for(var i=1, len=currentTabset.length; i < len; i++){
                if(id && currentTabset[i].id === id){
                    return i;
                }
            }
            return -1;
        }
        function addTabToTabsetAndOpen(tabset, data){
            var currentTabset = tabsets[tabset];

            var newTab = {
                active: true,
                heading: data.name,
                id: data._id,

                isDirty: function(){
                    if(this.dataBkp && this.data){
                        var dataBkpStr = JSON.stringify(this.dataBkp);
                        var dataStr = JSON.stringify(this.data);

                        return dataBkpStr !== "" && dataBkpStr !== dataStr;
                    }else{
                        //if we have no way of saying, we assume it is
                        return true;
                    }
                }
            }

            currentTabset.splice(currentTabset.length - 1, 0, newTab);
        }
        function closeTab(tabset, index){
            var currentTabset = tabsets[tabset];
            var tabToClose = currentTabset[index];

            if(tabToClose.isAddTab || tabToClose.isFirstTab){
                console.debug('Attempted to close un-closeable tab');

                return;
            }
            currentTabset.splice(index, 1);

            //Always select tab with table, do we really want that!?
            openTab(tabset, 0);
        }

        //Public Functions:
        function initTabset(list) {
            var currentList = list;
            var listTabHeading = '';
            var listTabTemplateURL = '';
            var tabTemplateURL = '';

            switch(list){
                case 'doctors':
                    listTabHeading = 'Doctors';
                    listTabTemplateURL = 'client/doctors/doctors.html';
                    tabTemplateURL = 'client/doctors/doctor.html';
                    break;
                case 'patients':
                    listTabHeading = 'Patients';
                    listTabTemplateURL = 'client/patients/patients.html';
                    tabTemplateURL = 'client/patients/patient.html';
                    break;
                default:
                    console.debug('ERROR: Tabset controller called with unhandled list parameter.');
            }

            var tabs = [{
                //Tab used to show list of posts (table)
                "isFirstTab": true,
                "hideCloseIcon": true,
                "heading": listTabHeading,
                "active": true,
                "template" : listTabTemplateURL
            },{
                //The tab used for adding a post
                "hideCloseIcon": true,
                "isAddTab": true,
                "heading": 'Add new',
                "active": false,
                "template" : tabTemplateURL,
                //This tab's data is considered dirty if its dataBkp differs from its data
                "isDirty": function(){
                    //TODO: Duplicated when creating new tab.
                    if(this.dataBkp && this.data){
                        var dataBkpStr = JSON.stringify(this.dataBkp);
                        var dataStr = JSON.stringify(this.data);

                        return dataBkpStr !== "" && dataBkpStr !== dataStr;
                    }else{
                        //if we have no way of saying, we assume it is
                        return true;
                    }
                }
            }
            ];

            tabsets[list] = tabs;
        }

        function getTabset(tabset) {
            return tabsets[tabset];
        }
        //function setTabset(tabsetName, tabs){
        //    var index = tabsets.indexOf(tabsetName);
        //    tabsets[index] = tabs;
        //}
        function openTab(tabset, index){
            tabsets[tabset][index].active = true;
        }

        //Always opens data in tab, if needed after adding tab to tabs.
        function openInTabCreateIfNeeded(tabset, data){
            var tabOfRequested = indexOfTab(tabset, data._id);
            if(tabOfRequested === -1){
                addTabToTabsetAndOpen(tabset, data);
            }else{
                openTab(tabset, tabOfRequested);
            }
        }
        function unInitTabset(tabset){
            angular.forEach(tabsets[tabset], function (tab) {
                tab.initiated = false;
            });
        }
        function closeActiveTab(tabset){
            var currentTabset = tabsets[tabset];//vm.tabs;

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
            openTab(tabset, 0);
        }
        function closeSpecifiedTab(tabset, id){
            var index = indexOfTab(tabset, id);
            if(index !== -1) {
                closeTab(tabset, index);
            }
        }

        function updateTabHeader(tabset, data){
            var index = indexOfTab(tabset, data);
            if(index !== -1){
                tabsets[tabset][index].heading = data.name;
            }
        }
    }
})();