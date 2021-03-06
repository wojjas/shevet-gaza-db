(function () {
    'use strict';

    angular
        .module('gdLoadingCover')
        .controller('LoadingCoverController', LoadingCover);

    LoadingCover.$inject = ['loadingCover'];

    function LoadingCover(loadingCover) {
        var vm = this;
        vm.loadingCoverData = loadingCover.data;
    }
})();