(function () {
    'use strict';

    angular
        .module('gdLoadingCover')
        .factory('loadingCover', loadingCover);

    function loadingCover($timeout) {
        var delayedShowIsLoadingTimer;
        var scope = {};
        var vm = {};
        var digest = digest;
        var delayedShowIsLoading = delayedShowIsLoading;
        var service = {
            //init: init,
            changeIsLoading: changeIsLoading
        };

        return service;

        ////////////////
        //If this doesn't seem to be a good idea, send scope and vm with each call to changeIsLoading
        //function init(controllersScope, controllersVm){
        //    scope = controllersScope;
        //    vm = controllersVm;
        //}

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

        function changeIsLoading(scope, vm, isLoading){
            if(isLoading){
                delayedShowIsLoadingTimer = delayedShowIsLoading(scope, vm, 1500);
                //service.isLoading = true;
            }else{
                clearTimeout(delayedShowIsLoadingTimer);
                //service.isLoading = false;
                vm.showIsLoading = false;
                digest(scope);
            }
        }

    }
})();