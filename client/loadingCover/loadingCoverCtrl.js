(function () {
    'use strict';

    angular
        .module('gdLoadingCover')
        .controller('loadingCover', LoadingCover);

    LoadingCover.$inject = ['loadingCover'];

    function LoadingCover(loadingCover) {
        var vm = this;
        //TODO: not implemented yet
        vm.action = loadingCover.getCurrentAction();
    }
})();