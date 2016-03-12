'use strict';

angular.module('core').factory('MainpageServices', ['RetrieveInventory', 'UserService',
    function (RetrieveInventory, UserService) {
        return {
            updateOrder: function ($scope, type, index) {
                var self = this;
                switch (type) {
                    case 'increase':
                        $scope.data.orders[index].quantity++;
                        $scope.data.subtotal += $scope.data.orders[index].price;
                        if (!$scope.data.orders[index].isGiftcard && !$scope.data.orders[index].isPointcard) {
                            $scope.data.tax += 0.13 * $scope.data.orders[index].price;
                        }
                        break;
                    case 'decrease':
                        if ($scope.data.orders[index].quantity > 0) {
                            $scope.data.orders[index].quantity--;
                            $scope.data.subtotal -= $scope.data.orders[index].price;
                            if (!$scope.data.orders[index].isGiftcard && !$scope.data.orders[index].isPointcard) {
                                $scope.data.tax -= 0.13 * $scope.data.orders[index].price;
                            }
                            if ($scope.data.orders[index].quantity === 0) {
                                self.removeItem($scope, $scope.data.orders[index], 'decreased');
                            }
                        }
                        break;
                }
            },
            addItem: function ($scope, item) {
                console.log(item);
                var result = {};
                var index = -1;
                var added = true;
                var prevItem = _.find($scope.data.orders, function (order) {
                    index++;
                    return order.id === item._id;
                });

                var newQty = (prevItem) ? $scope.data.orders[index].quantity + 1 : 1;

                if ( ( item.quantity && item.quantity - newQty >= 0 ) || !item.quantity ) {
                    if (!prevItem) {
                        $scope.data.orders.push(_.clone({
                            'id': item._id,
                            'name': item.name,
                            'price': item.price,
                            'quantity': 1,
                            'barcode': (item.barcode === undefined)  ? '' : item.barcode,
                            'itemType': (item.type === undefined || item.type !== 'StockItem')? '' : 'StockItem',
                            'index': $scope.data.orders.length,
                            'isGiftcard': (item.isGiftcard === undefined) ? false : item.isGiftcard,
                            'isPointcard': (item.isPointcard === undefined) ? false : item.isPointcard,
                            'pcNumber': (item.pcNumber === undefined) ? '': item.pcNumber,
                            'pcType': (item.pcType === undefined) ? '': item.pcType,
                            'pcRedeem': (item.pcRedeem === undefined) ? '': item.pcRedeem
                        }));
                    } else {
                        $scope.data.orders[index].quantity++;
                    }
                } else if ( item.quantity && item.quantity - newQty < 0 ) {
                    added = false;
                    result = { alert: "No stock remaining." };
                    return result;
                }

                // TODO unhardcode 5
                // Check if Item is StockItem. If it is, performs check on remaining stock qty
                if ( item.quantity ) {
                    var remaining = item.quantity - newQty;
                    if ( remaining === 5 ) {
                        result = { alert: 'Stock for "' + item.name + '" is low. Quantity remaining: ' + remaining };
                    } else if ( remaining === 0 ) {
                        result = { alert: 'Stock for "' + item.name + '" has been depleted. Quantity remaining: ' + remaining };
                    }
                }

                if (added) {
                    $scope.data.subtotal += item.price;
                }

                if (!item.isGiftcard && !item.isPointcard) {
                    $scope.data.tax += 0.13 * item.price;
                }

                return result;
            },
            /**
             *
             * @param $scope
             * @param cat
             */
            getItem: function ($scope, cat) {
                var body = {
                    'type': 'retrieveItem',
                    'category': cat
                };
                RetrieveInventory.load(body, function (response) {
                    $scope.data.items = _.map(response, _.clone);
                });
            },
            saveOrder: function ($scope) {
                var body = {
                    'type': 'saveOrder',
                    'paymentType': $scope.data.selectedPayment,
                    'orders': $scope.data.orders,
                    'user': UserService.getUser(),
                    'order': $scope.data.order,
                    'customerName': $scope.data.customerName,
                    'subtotal': $scope.data.subtotal,
                    'tax': $scope.data.tax,
                    'discount': $scope.data.discount,
                    'discountType': $scope.data.discountType,
                    'discountPrice': $scope.data.discountPrice,
                    'customerID': $scope.data.customerID,
                    'ticketNumber': $scope.data.ticketNumber
                };
                RetrieveInventory.load(body, function (response) {
                    //$scope.data.items = _.map(response, _.clone);
                });
            },
            removeItem: function ($scope, item, decreased) {
                $scope.data.orders = _.without($scope.data.orders, item);
                var index = 0;
                _.each($scope.data.orders, function (order) {
                    order.index = index;
                    index++;
                });
                if (!item.isGiftcard && !item.isPointcard && !decreased) {
                    $scope.data.tax -= 0.13 * item.quantity * item.price;
                }
                $scope.data.subtotal -= item.quantity * item.price;
                if ($scope.data.subtotal === 0) {
                    $scope.data.subtotal = 0;
                }
            }

        };
    }
]);
