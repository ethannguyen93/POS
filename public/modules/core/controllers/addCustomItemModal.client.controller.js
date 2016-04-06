'use strict';

// Workflows controller
angular.module('core').controller('addCustomItemController', [
    '$scope', '$modalInstance',
    function ($scope, $modalInstance) {
        var sanitize = function(text){
            if (text === undefined){
                return ''
            }else{
                return text.toString();
            }
        };
        $scope.data = {
            name: sanitize(''),
            price: sanitize(''),
            isError: false,
            errorMessage: ''
        };
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.add = function(){
            $scope.data.name = sanitize($scope.data.name);
            $scope.data.price = sanitize($scope.data.price);
            if ($scope.data.name === '' || $scope.data.price === ''){
                $scope.data.errorMessage = 'Please enter both Item name and Price';
                $scope.data.isError = true;
            }else if (isNaN($scope.data.price)){
                $scope.data.errorMessage = 'Please enter a valid Price';
                $scope.data.isError = true;
            }else{
                $modalInstance.close({name: $scope.data.name, price: parseFloat($scope.data.price)});
            }
        };
        $scope.cancel = function(){
            $modalInstance.close();
        };
    }]
);
