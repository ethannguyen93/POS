'use strict';

// Workflows controller
angular.module('customers').controller('removeCustomerController', [
    '$scope', '$modalInstance', 'RetrieveCustomer', 'customer',
    function ($scope, $modalInstance, RetrieveCustomer, customer) {
        $scope.remove = function(){
            var body = {
                type: 'remove',
                id: customer.id
            };
            RetrieveCustomer.load(body, function(response){
                $modalInstance.close('yes');
            })
        };
        $scope.cancel = function(){
            $modalInstance.close('no');
        };
    }]
);
