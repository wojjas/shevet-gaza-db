(function () {
    'use strict';

    app.service('config', config);

    function config() {
        //When offlineMode === true, app should act as an offline application.
        //With no server calls. (eg. persist in LocalStorage, instead of server)
        var offlineMode = false;

        var service = {
            setOfflineMode: setOfflineMode,
            getOfflineMode: getOfflineMode
        };

        return service;

        ////////////////
        function setOfflineMode(isOffline){
            offlineMode = isOffline;
            window.localStorage['offlineMode'] = JSON.stringify(isOffline);
        }
        function getOfflineMode(){
            offlineMode = window.localStorage['offlineMode'] ?
                JSON.parse(window.localStorage['offlineMode']):
                false;

            return offlineMode;
        }
    }
})();
