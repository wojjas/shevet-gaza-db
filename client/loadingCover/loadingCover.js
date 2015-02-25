(function () {
    'use strict';

    angular
        .module('gdLoadingCover')
        .factory('loadingCover', loadingCover);

    function loadingCover($timeout) {
        var data = {};
        var DELAY = 1500;
        var noDelayOfNextShow = false;
        var promise;

        var service = {
            showLoadingCover: showLoadingCover,
            hideLoadingCover: hideLoadingCover,
            data: data
        };

        return service;

        ///////////

        // Set noDelay to false if there's an action following this and we don't want
        // an delay of the loading cover. For example: Delete of one row then re-fetch of table.
        function showLoadingCover(action, noDelayOfNext) {
            if(promise){
                console.debug('Attempted to start delayed show of loading cover for action ' +
                action + ' when action: ' + this.data.action +
                ' is already scheduled. Calls to server (actions) should be performed in sequence.');

                data.action = action;
                return;
            }

            //Sets delay or not depending on flag in last call
            var delay = noDelayOfNextShow ? 0 : DELAY;
            noDelayOfNextShow = noDelayOfNext;

            promise = $timeout(function(){
                data.show = true;
                data.action = action;
            }, delay);
        }

        function hideLoadingCover() {
            //Important to cancel if "hide" is called before loading cover is shown.
            $timeout.cancel(promise);
            promise = undefined;

            data.show = false;
            data.action = '';
        }
    }
})();