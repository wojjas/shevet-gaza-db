(function () {
    'use strict';

    /*
        This is a wrapper for toastr.js included with bower.
        NB: Although toastr can be accessed directly one should use this factory instead.
     */
    angular
        .module('gdCommon')
        .factory('notifier', notifier);

    function notifier() {
        var service = {
            success: success,
            error: error,
            warning: warning,
            info: info
        };

        return service;

        ////////////////

        function success(message, title) {
            showToastr('success', message, title);
        }
        function error(message, title) {
            showToastr('error', message, title);
        }
        function warning(message, title) {
            showToastr('warning', message, title);
        }
        function info(message, title) {
            showToastr('info', message, title);
        }

        function showToastr(type, message, title){
            toastr.options.timeOut = (type === 'error' ? 5000 : 1400);
            //Show longer messages for a longer period of time:
            if(message.length > 0){
                toastr.options.timeOut += 1000;
            }
            if(message.length > 20){
                toastr.options.timeOut += 2000;
            }
            if(toastr.options.timeOut >= 2500){
                toastr.options.closeButton = true;
            }else{
                toastr.options.closeButton = false;
            }

            switch (type){
                case 'success':
                    toastr.success(message, title);
                    break;
                case 'error':
                    toastr.error(message, title);
                    break;
                case 'warning':
                    toastr.warning(message, title);
                    break;
                case 'info':
                    toastr.info(message, title);
                    break;

                default:
                    toastr.info(message, title);
            }
        }
    }
})();