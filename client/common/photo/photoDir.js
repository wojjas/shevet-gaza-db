(function () {
    'use strict';

    angular
        .module('gdPhoto')
        .directive('gdPhoto', photoUploader);

    function photoUploader() {
        var directive = {
            restrict: 'E',

            scope:{
                canvasId: "@",
                photo: "="
            },

            templateUrl:'/client/common/photo/photo.html',
            controller: 'PhotoController as photoCtrl',
            bindToController: true
        };
        return directive;
    }
})();