'use strict';

// Workflows controller
angular.module('customers').controller('editCustomerController', [
    '$scope', '$modalInstance', 'RetrieveCustomer', 'customer',
    function ($scope, $modalInstance, RetrieveCustomer, customer) {
        var sanitize = function(text){
            if (text === undefined){
                return ''
            }else{
                return text.toString();
            }
        };
        $scope.data = {
            name: sanitize(customer.name),
            phone: sanitize(customer.phone),
            email: sanitize(customer.email),
            address: sanitize(customer.address),
            isError: false,
            errorMessage: ''
        };
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.edit = function(){
            var body = {
                type: 'update',
                name: sanitize($scope.data.name),
                phone: sanitize($scope.data.phone),
                email: sanitize($scope.data.email),
                address: sanitize($scope.data.address),
                id: sanitize(customer.id)
            };
            RetrieveCustomer.load(body, function(response){
                if (response[0].name === undefined){
                    body.type = 'update';
                    RetrieveCustomer.load(body, function(response){
                       $modalInstance.close({
                           name: $scope.data.name,
                           phone: $scope.data.phone,
                           email: $scope.data.email,
                           address: $scope.data.address,
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
