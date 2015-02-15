(function () {
    'use strict';

    //app.factory('tabsets', tabsets);
    angular
        .module('gdCommon')
        .factory('tabsets', tabsets);

    function tabsets() {
        var tabsets = [[]];
        var indexOfOpenedTab = indexOfOpenedTab;
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
        function indexOfOpenedTab(tabset, data){
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
                active: true
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
                "template" : tabTemplateURL
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
            var tabOfRequested = indexOfOpenedTab(tabset, data);
            if(tabOfRequested === -1){
                addTabToTabsetAndOpen(tabset, data);
            }else{
                openTab(tabset, tabOfRequested);
            }
        }
        function closeTab(tabset, index){
            var currentTabset = tabsets[tabset];//vm.tabset;

            if(index){
                if(currentTabset[index].isAddTab){
                    return;
                }
                currentTabset.splice(index, 1);
                //vm.nofOpenedTabs = currentTabset.length - 2;
            }else{
                //If no index it's called from child-scope
                for(var i=1, len=currentTabset.length; i < len; i++){
                    if(currentTabset[i].active && !currentTabset[i].isAddTab){
                        currentTabset.splice(i, 1);
                        break;
                    }
                }
                //currentTabset[0].active = true;
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
            var index = indexOfOpenedTab(tabset, data);
            tabsets[tabset][index].heading = data.name;
        }
        function closeTabDeletedInList(tabset, data){
            var index = indexOfOpenedTab(tabset, data);
            if(index !== -1){
                closeTab(tabset, index);
            }
        }
    }
})();