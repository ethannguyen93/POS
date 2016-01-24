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
                        if (!$scope.data.orders[index].isGiftcard) {
                            $scope.data.tax += 0.13 * $scope.data.orders[index].price;
                        }
                        break;
                    case 'decrease':
                        if ($scope.data.orders[index].quantity > 0) {
                            $scope.data.orders[index].quantity--;
                            $scope.data.subtotal -= $scope.data.orders[index].price;
                            if (!$scope.data.orders[index].isGiftcard) {
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
                var index = -1;
                var prevItem = _.find($scope.data.orders, function (order) {
                    index++;
                    return order.id === item._id;
                });
                if (prevItem === undefined) {
                    $scope.data.orders.push(_.clone({
                        'id': item._id,
                        'name': item.name,
                        'price': item.price,
                        'quantity': 1,
                        'index': $scope.data.orders.length,
                        'isGiftcard': (item.hasOwnProperty('number'))
                    }));
                } else {
                    $scope.data.orders[index].quantity++;
                }
                $scope.data.subtotal += item.price;
                if (!item.isGiftcard) {
                    $scope.data.tax += 0.13 * item.price;
                }
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
                    'orders': $scope.data.orders,
                    'user': UserService.getUser(),
                    'order': $scope.data.order,
                    'customerName': $scope.data.customerName,
                    'subtotal': $scope.data.subtotal,
                    'tax': $scope.data.tax,
                    'discount': $scope.data.discount,
                    'discountPrice': $scope.data.discountPrice
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
                if (!item.isGiftcard && !decreased) {
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
