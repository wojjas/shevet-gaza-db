(function () {
    'use strict';

    angular
        .module('gdLoadingCover')
        .factory('loadingCover', loadingCover);

    function loadingCover($timeout) {
        var delayedShowIsLoadingTimers = {};
        var currentAction = '';
        var digest = digest;
        var vm = {};
        var delayedShowIsLoading = delayedShowIsLoading;

        var service = {
            changeIsLoading: changeIsLoading,
            getCurrentAction: getCurrentAction
        };

        return service;

        //Private functions:
        function digest(scope){
            if(!scope.$$phase){
                scope.$digest();
            }
        }
        //Delays setting of flag that makes View display progress-gif.
        function delayedShowIsLoading(scope, vm, delay){
            return setTimeout(function () {
                vm.showIsLoading = true;
                digest(scope);
            }, delay);
        }

        function changeIsLoading(scope, vm, action, isLoading){
            if(isLoading){
                delayedShowIsLoadingTimers[action] = delayedShowIsLoading(scope, vm, 1500);
                currentAction = action;

                //service.isLoading = true;
            }else{
                clearTimeout(delayedShowIsLoadingTimers[action]);
                delete delayedShowIsLoadingTimers[action];

                //service.isLoading = false;
                vm.showIsLoading = false;
                digest(scope);
            }
        }

        function getCurrentAction(){
            return currentAction;
        }
    }
})();