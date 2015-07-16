(function () {
    'use strict';

    angular
        .module('gdAuth')
        .factory('formEncoder', formEncoder);

    //formEncode.$inject = ['DEP'];

    function formEncoder() {
        var service = {
            encode: encode
        };

        return service;

        ////////////////

        function encode(data) {
            var pairs = [];

            for(var name in data){
                pairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            }

            return pairs.join('&').replace(/%20/g, '+');
        }
    }
})();