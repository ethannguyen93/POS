'use strict';

// Workflows controller
angular.module('core').controller('printingCtrl',
    function ($scope, $stateParams, $location, $modalInstance, UserService, RetrieveInventory, data) {
        var server = {'name' : ''};
        if (data.selectedEmployee === undefined || data.selectedEmployee === ''){
            server = UserService.getUser();
        }else{
            server = {'name' : data.selectedEmployee};
        }
        var body = {
            'type': 'printReceipt',
            'id': data.id,
            'order': data.index,
            'orders': data.orders,
            'user': server,
            'actualEmployee': UserService.getUser(),
            'customerName': data.customerName,
            'subtotal': data.subtotal,
            'tax': data.tax,
            'paymentType': data.selectedPayment,
            'discount': data.discount,
            'discountPrice': data.discountPrice,
            'customerID': data.customerID,
            'ticketNumber': data.ticketNumber
        };
        RetrieveInventory.load(body, function(response){
            data.id = response[0];
            $modalInstance.close();
        });
    }
);
