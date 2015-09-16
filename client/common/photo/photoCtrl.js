(function () {
    'use strict';

    angular
        .module('gdPhoto')
        .controller('PhotoController', photoCtrl);

    photoCtrl.$inject = ['$scope', '$timeout'];

    function photoCtrl($scope, $timeout) {
        var photoInitiated = false;
        var vm = this;
        vm.defaultPhoto = '';
        vm.textOverPhoto = '';

        vm.showTextOverPhoto = showTextOverPhoto;
        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
            vm.defaultPhoto = 'data:image/png;base64,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';

            //Redraw the photo on canvas
            if(vm.photo){
                //Wrapped in timeout for the canvas to be painted before redraw on it
                $timeout(function(){
                    resizeAndDrawImage(vm.photo);
                }, 100);
            }
        }

        function showTextOverPhoto(yes){
            if(!yes){
                vm.textOverPhoto = "";

                return;
            }

            if(vm.photo){
                vm.textOverPhoto = "Click to change photo...";
            }else{
                vm.textOverPhoto = "Click to add a photo...";
            }
        }

        //This will fire whenever file is choosen
        $scope.handleFileChosen = function(element){
            $scope.$apply(function(scope){
                var chosenFile = element.files[0];

                //Now that we have a file-name of the chosen file, read it (from disk into browser's javaScript)
                var reader = new FileReader();
                reader.onload = function(e){
                    $scope.$apply(function(){
                        vm.photo = e.target.result;
                    });

                    //Photo read into browser, use it:
                    resizeAndDrawImage(vm.photo);
                };
                reader.readAsDataURL(chosenFile);
            });
        };

        function resizeAndDrawImage(dataUrl){
            //Use a canvas:
            var img = new Image();

            //onload will ensure that the image is loaded, meaning that img.src = dataUrl completed.
            //This is needed on some browsers. If we use img before img.src is loaded its width and height = 0.
            //resulting in resizing our canvas to 0, 0.
            img.onload = function(){
                //Resize to fit canvas:
                var MAX_WIDTH = 175;
                var MAX_HEIGHT = 175;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                //ignore the decimal part as it will disappear anyway, when setting canvas?
                width = Math.floor(width);
                height = Math.floor(height);

                var canvas = document.getElementById(vm.canvasId);
                canvas.width = width;
                canvas.height = height;

                //TODO: Size and data, "before redraw" and "after redraw" differs! some times. This makes a "false" diff in common/tabsets.js
                //console.log('0) Before redraw: ' + vm.photo.length);

                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                var imageDataURL = canvas.toDataURL("image/jpeg");

                //console.log('1) After redraw: ' + imageDataURL.length + ' ' + canvas.toDataURL("image/jpeg"));

                vm.photo = imageDataURL;
                $scope.$apply();
            };
            img.src = dataUrl;
        }

        //This is because we want to resize the photo to fit this directive's view's canvas
        //no matter what comes from the db. Only do this once, at init.
        $scope.$watch(function(){
            return vm.photo;
        }, function(newValue, oldValue){
            if(newValue === oldValue){
                return;
            }
            if(!photoInitiated && vm.photo){
                $timeout(function(){
                  resizeAndDrawImage(vm.photo);
                }, 0);
                photoInitiated = true;
            }
        })
    }
})();