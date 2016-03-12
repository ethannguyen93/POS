'use strict';

// Workflows controller
angular.module('core').controller('notificationCtrl',
    function ($scope, $stateParams, $location, $modalInstance, notification) {
        $scope.message = notification;

        $scope.ok = function () {
            $modalInstance.close('yes');
        };

        $scope.cancel = function () {
            $modalInstance.close('no');
        };
    }
);
