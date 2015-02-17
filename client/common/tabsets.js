(function () {
    'use strict';

    //app.factory('tabsets', tabsets);
    angular
        .module('gdCommon')
        .factory('tabsets', tabsets);

    function tabsets() {
        var tabsets = [[]];
        var indexOfTab = indexOfTab;
        var openTab;
        var addTabToTabsetAndOpen = addTabToTabsetAndOpen;

        var service = {
            initTabset: initTabset,
            getTabset: getTabset,
            //setTabset: setTabset,
            unInitTabset: unInitTabset,

            openInTabCreateIfNeeded: openInTabCreateIfNeeded,
            updateTabHeader: updateTabHeader,
            closeTabDeletedInList: closeTabDeletedInList,
            closeTab: closeTab
        };

        return service;

        ////////////////

        //Private Functions:
        function indexOfTab(tabset, data){
            var currentTabset = tabsets[tabset]; // vm.tabset;
            for(var i=1, len=currentTabset.length; i < len; i++){
                if(data._id && currentTabset[i].id === data._id){
                    return i;
                }
            }
            return -1;
        }
        function openTab(tabset, index){
            tabsets[tabset][index].active = true;
        }
        function addTabToTabsetAndOpen(tabset, data){
            var currentTabset = tabsets[tabset];

            var newTab = {
                heading: data.name,
                id: data._id,
                template: currentTabset[currentTabset.length - 1].template,
                active: true,
                //This tab's data is considered dirty if its dataBkp differs from its data
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
        //function setTabset(tabsetName, tabset){
        //    var index = tabsets.indexOf(tabsetName);
        //    tabsets[index] = tabset;
        //}

        //Always opens data in tab, if needed after adding tab to tabset.
        function openInTabCreateIfNeeded(tabset, data){
            var tabOfRequested = indexOfTab(tabset, data);
            if(tabOfRequested === -1){
                addTabToTabsetAndOpen(tabset, data);
            }else{
                openTab(tabset, tabOfRequested);
            }
        }
        function closeTab(tabset){
            var currentTabset = tabsets[tabset];//vm.tabset;

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
        function unInitTabset(tabset){
            angular.forEach(tabsets[tabset], function (tab) {
                tab.initiated = false;
            });
        }

        function updateTabHeader(tabset, data){
            var index = indexOfTab(tabset, data);
            if(index !== -1){
                tabsets[tabset][index].heading = data.name;
            }
        }
        function closeTabDeletedInList(tabset, data){
            var index = indexOfTab(tabset, data);
            if(index !== -1){
                closeTab(tabset, index);
            }
        }
    }
})();