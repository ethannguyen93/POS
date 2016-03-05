'use strict';

// Workflows controller
angular.module('admin').controller('editQuantityCtrl', [ '$scope', '$modalInstance', 'item', 'RetrieveStock',
    function ($scope, $modalInstance, item, RetrieveStock) {
        $scope.data = {
            quantity: 0,
            type: ['Remove', 'Add'],
            typeSelected: 'Remove',
            isError: false,
            errorMessage: ''
        };
        $scope.finish = function(){
            $modalInstance.close(0);
        };
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.edit = function(){
            if ($scope.data.typeSelected === 'Remove' && $scope.data.quantity > item.quantity){
                $scope.data.isError = true;
                $scope.data.errorMessage = 'Can\'t remove more than current quantity (' + item.quantity + ').';
            }else{
                var body = {
                    type: 'editQuantity',
                    quantity: $scope.data.quantity,
                    typeQuantity: $scope.data.typeSelected,
                    item: item
                };
                RetrieveStock.load(body, function(response){
                    var change = ($scope.data.typeSelected === 'Remove') ? -$scope.data.quantity : $scope.data.quantity;
                    $modalInstance.close(change);
                })
            }
        }
    }
]);
