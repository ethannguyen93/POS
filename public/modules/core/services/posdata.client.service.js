'use strict';

angular.module('core').factory('POSData', [function() {
    // Default Boilerplate
    var _default = {
        paymentTypes: ['Cash', 'DebitCard', 'CreditCard'],
        selectedPayment: 'Cash',
        ticketNumber: '',
        discount: '',
        discountPrice: 0,
        password : '',
        order: 0,
        index: 0,
        orders: [],
        categories: [],
        items: [],
        subtotal: 0,
        tax: 0,
        isTax: true,
        //if discountType is true: % else $
        discountType: true,
        employees: [],
        selectedEmployee: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerID: '',
        gridOptions: {
            rowHeight: 60,
            columnHeaderHeight: 60,
            columnFooterHeight: 60,
            enablePaginationControls: false,
            showColumnFooter: true,
            paginationPageSize: 10,
            data: 'data.orders'
        }
    };
    // Holder for actual data
    var _data = {};

    return {
        init: function() {
            _data = JSON.parse(JSON.stringify(_default));
            return _data;
        },
        get: function() {
            return _data;
        }
    }

}]);
