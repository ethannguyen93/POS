'use strict';

// Workflows controller
angular.module('admin').controller('imageViewerCtrl', [ '$scope', '$modalInstance', 'image',
    function ($scope, $modalInstance, image) {
        $scope.image = image;
    }
]);
