(function () {
    'use strict';

    angular
        .module('gdCommon')
        .factory('tabset', ['openedTabs', tabset]);

    function tabset(openedTabs) {
        //TODO: Nice tool put in some global string-tool-box
        //Replaces every occurrence of "substring" in "string" with "newSubstring"
        function removeSubstring(string, substring, newSubstring){
            var substringWithEscapedSpecialChars = substring.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

            return string.replace(new RegExp(substringWithEscapedSpecialChars, 'g'), newSubstring);
        }

        var Tabsets = function(){
            var tabset = [];
            var currentView = '';     //TODO: rename currentView to view.
            var that = this;

            //Private functions:
            function indexOfTab(id){
                for(var i = 1, len = tabset.length; i < len; i++){
                    if(id && tabset[i].id === id){
                        return i;
                    }
                }
                return -1;
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
            function addTabToTabsetAndOpen(data){
                var newTab = {
                    active: true,           //Open this tab
                    heading: getObjectsName(data),
                    id: data._id,

                    isDirty: isDirty
                }

                tabset.splice(tabset.length - 1, 0, newTab);
            }
            function closeTab(index){
                var tabToClose = tabset[index];

                if(tabToClose.isAddTab || tabToClose.isFirstTab){
                    console.debug('Attempted to close un-closeable tab');

                    return;
                }
                tabset.splice(index, 1);

                //Always select tab with table, do we really want that!?
                that.openTab(0);
            }

            //Privileged functions:
            this.initTabset = function initTabset(view) {
                var tableTabHeading = '';

                currentView = view;
                tabset = openedTabs.getTabset(view);

                //If there's nothing for specified view, init one:
                if(!tabset || tabset.length == 0){

                    var viewRelevantPart = (view.indexOf('_') === -1) ?
                        view :
                        view.substring(0, view.indexOf('_'));

                    switch(viewRelevantPart){
                        case 'doctors':
                            tableTabHeading = 'Doctors';
                            break;
                        case 'patients':
                            tableTabHeading = 'Patients';
                            break;
                        case 'contacts':
                            tableTabHeading = 'Contacts';
                            break;
                        case 'relatedContacts':
                            tableTabHeading = 'Contacts Related to Patient';
                            //TODO: use the same as for contacts above?
                            break;
                        default:
                            tableTabHeading = 'Undefined';
                            console.debug('ERROR: Tabset controller called with unhandled view parameter.');
                    }

                    var tabs = [{
                        //Tab used to show view of posts (table)
                        "isFirstTab": true,
                        "hideCloseIcon": true,
                        "heading": tableTabHeading,
                        "active": true
                    }];

                    //Add New or Add Existing (for related contacts)
                    if(view.indexOf('relatedContacts') >= 0){
                        tabs.push({
                            "isAddExistingTab": true,
                            "heading": 'Add Existing',
                            "active": false
                        })
                    }else{
                        tabs.push({
                            //The tab used for adding a post
                            "hideCloseIcon": true,
                            "isAddTab": true,
                            "heading": 'Add new',
                            "active": false,

                            isDirty: isDirty
                        });
                    }

                    tabset = tabs;
                    openedTabs.setTabset(view, tabset);
                }
            }
            this.updateTabset = function updateTabset(){
                openedTabs.setTabset(currentView, tabset);
            }
            this.getTabset = function getTabset() {
                return tabset;
            }
            this.openInTabCreateIfNeeded = function openInTabCreateIfNeeded(data){
                    var tabOfRequested = indexOfTab(data._id);
                    if(tabOfRequested === -1){
                        addTabToTabsetAndOpen(data);
                    }else{
                        that.openTab(tabOfRequested);
                    }
            }
            this.openTab = function openTab(index){
                tabset[index].active = true;
            }
            this.closeSpecifiedTab = function closeSpecifiedTab(id){
                var index = indexOfTab(id);
                if(index !== -1) {
                    closeTab(index);
                }
            }
            this.removeTabset = function removeTabset(){
                openedTabs.removeTabset(currentView);
            }
        }


        /////////////////////////////
        //This tab's data is considered dirty if its dataBkp differs from its data
        function isDirty(){
            if(this.dataBkp && this.data){
                var dataBkpStr = angular.toJson(this.dataBkp);
                var dataStr = angular.toJson(this.data);

                //Ignore empty objects by removing them before comparison:
                //This is a hack to handle Patient's related-contact's contact-number's dummy object
                //This dummy is added when a related contact tab is opened (by then patien's dataBkp is already set)
                dataStr = removeSubstring(dataStr, ',{}', '');
                dataBkpStr = removeSubstring(dataBkpStr, ',{}', '');

                return dataBkpStr !== "" && dataBkpStr !== dataStr;
            }else{
                //if we have no way of saying, we assume it is
                console.debug('No way of saying if tab is dirty, assume it is.');
                return true;
            }
        }


        /////////////////////////////
        return {
            tabset : Tabsets,
            updateTabset : true //Flag governs if tabset should be updated or not
        }
    }
})();