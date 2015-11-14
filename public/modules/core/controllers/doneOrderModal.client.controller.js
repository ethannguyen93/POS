'use strict';

// Workflows controller
angular.module('core').controller('ModalInstanceCtrl',
    function ($scope, $stateParams, $location, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close('yes');
        };

        $scope.cancel = function () {
            $modalInstance.close('no');
        };
    }
);
