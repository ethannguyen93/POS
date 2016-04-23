'use strict';

// Workflows controller
angular.module('customers').controller('CapturePhotoController', [
    '$scope', '$modalInstance', 'RetrieveCustomer', 'customerID',
    function ($scope, $modalInstance, RetrieveCustomer, customerID) {
        $scope._video = null;
        $scope.patData = null;
        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = $scope._video.width;
            hiddenCanvas.height = $scope._video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage($scope._video, 0, 0, $scope._video.width, $scope._video.height);
            return ctx.getImageData(x, y, w, h);
        };
        $scope.captured = false;
        $scope.retake = function(){
            $scope.captured = false;
        };
        $scope.capturedImage = null;
        $scope.patOpts = {x: 0, y: 0, w: 250, h: 250};
        $scope.channel = {};
        $scope.onSuccess = function () {
            // The video element contains the captured camera data
            $scope._video = $scope.channel.video;
            $scope.$apply(function() {
                $scope.patOpts.w = $scope._video.width;
                $scope.patOpts.h = $scope._video.height;
                $scope.showDemos = true;
            });
        };
        $scope.capture = function(){
            if ($scope._video){
                var patCanvas = document.querySelector('#snapshot');
                if (!patCanvas) return;

                patCanvas.width = $scope._video.width;
                patCanvas.height = $scope._video.height;
                var ctxPat = patCanvas.getContext('2d');

                var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
                ctxPat.putImageData(idata, 0, 0);
                $scope.captured = true;
                $scope.capturedImage = patCanvas.toDataURL();
                $scope.patData = idata;
            }
        };
        $scope.save = function(){
            $scope.$broadcast('STOP_WEBCAM');
            var body = {
                type: 'addPhoto',
                customerID: customerID,
                img: $scope.capturedImage
            };
            RetrieveCustomer.load(body, function(){
                $modalInstance.close(customerID+'-image.png');
            });
        };
        $scope.cancel = function(){
            $modalInstance.close();
        };
    }]
);
