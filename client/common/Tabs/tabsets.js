(function () {
    'use strict';

    angular
        .module('gdCommon')
        .factory('tabsets', tabsets);

    function tabsets() {
        var Tabsets = function(){
            var tabset = [];
            var that = this;

            //Private functions:
            function indexOfTab(view, id){
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
            function addTabToTabsetAndOpen(view, data){
                var newTab = {
                    active: true,           //Open this tab
                    heading: getObjectsName(data),
                    id: data._id,

                    isDirty: isDirty
                }

                tabset.splice(tabset.length - 1, 0, newTab);
            }
            function closeTab(view, index){
                var tabToClose = tabset[index];

                if(tabToClose.isAddTab || tabToClose.isFirstTab){
                    console.debug('Attempted to close un-closeable tab');

                    return;
                }
                tabset.splice(index, 1);

                //Always select tab with table, do we really want that!?
                that.openTab(view, 0);
            }

            //Privileged functions:
            this.initTabset = function initTabset(view) {
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

                tabset = tabs;
            }
            this.getTabset = function getTabset(view) {
                return tabset;
            }
            this.openInTabCreateIfNeeded = function openInTabCreateIfNeeded(view, data){
                    var tabOfRequested = indexOfTab(view, data._id);
                    if(tabOfRequested === -1){
                        addTabToTabsetAndOpen(view, data);
                    }else{
                        that.openTab(view, tabOfRequested);
                    }
            }
            this.openTab = function openTab(view, index){
                tabset[index].active = true;
            }
            this.closeActiveTab = function closeActiveTab(view){
                //Start at i=1 as we never want to close the FirstTab
                for(var i=1, len=tabset.length; i < len; i++){
                    if(tabset[i].active &&
                        !tabset[i].isAddTab &&
                        !tabset[i].isFirstTab){
                        tabset.splice(i, 1);
                        break;
                    }
                }

                //Always select tab with table after closing a tab.
                that.openTab(view, 0);
            }
            this.closeSpecifiedTab = function closeSpecifiedTab(view, id){
                var index = indexOfTab(view, id);
                if(index !== -1) {
                    closeTab(view, index);
                }
            }
        }


        /////////////////////////////
        //This tab's data is considered dirty if its dataBkp differs from its data
        function isDirty(){
            if(this.dataBkp && this.data){
                var dataBkpStr = JSON.stringify(this.dataBkp);
                var dataStr = JSON.stringify(this.data);

                return dataBkpStr !== "" && dataBkpStr !== dataStr;
            }else{
                //if we have no way of saying, we assume it is
                console.debug('No way of saying if tab is dirty, assume it is.');
                return true;
            }
        }


        /////////////////////////////
        return {
            tabsets : Tabsets
        }
    }
})();