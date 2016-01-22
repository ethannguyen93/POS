'use strict';

// Workflows controller
angular.module('scheduler').controller('editCustomerController', [
    '$scope', '$modalInstance', 'RetrieveCustomer', 'customer',
    function ($scope, $modalInstance, RetrieveCustomer, customer) {
        $scope.data = {
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            isError: false,
            errorMessage: ''
        };
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.edit = function(){
            var body = {
                type: 'getCustomer',
                name: $scope.data.name,
                phone: $scope.data.phone,
                email: $scope.data.email,
                id: customer.id
            };
            RetrieveCustomer.load(body, function(response){
                if (response[0].name === undefined){
                    body.type = 'update';
                    RetrieveCustomer.load(body, function(response){
                       $modalInstance.close({
                           name: $scope.data.name,
                           phone: $scope.data.phone,
                           email: $scope.data.email,
                           id: customer.id
                       }
                       );
                    });
                }else{
                    $scope.data.isError = true;
                    $scope.data.errorMessage = 'Customer is already existed';
                }
            })
        };
        $scope.cancel = function(){
            $modalInstance.close();
        };
    }]
);
