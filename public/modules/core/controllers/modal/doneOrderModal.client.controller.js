'use strict';

// Workflows controller
angular.module('core').controller('doneOrderCtrl',
    function ($scope, $stateParams, $location, $modalInstance, data) {
        $scope.data = data;
        $scope.cash = {
            amount: '',
            change: ''
        };
        $scope.$watch('cash.amount', function(){
            if ($scope.cash.amount && $scope.cash.amount !== ''){
                $scope.cash.change = (parseFloat($scope.cash.amount) - (data.subtotal + data.tax - data.discountPrice)).toFixed(2);
                $scope.cash.change = Math.round($scope.cash.change * 20)/20
            }else{
                $scope.cash.change = '';
            }
        });
        $scope.ok = function () {
            $modalInstance.close('yes');
        };

        $scope.cancel = function () {
            $modalInstance.close('no');
        };
    }
);
