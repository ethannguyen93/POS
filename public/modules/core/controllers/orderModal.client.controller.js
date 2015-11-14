'use strict';

// Workflows controller
angular.module('core').controller('orderCtrl',
    function ($scope, $stateParams, $location, $modalInstance, currentUser, RetrieveInventory) {
        $scope.data = {
            orders: [],
            view: 'selection'
        };
        $scope.selectOrder = function(index, user){
            var body = {
                type: 'selectOneOrder',
                user: user,
                index: index
            };
            RetrieveInventory.load(body, function(response){
                $modalInstance.close({'message': 'order', 'data': response[0]});
            });
        };
        $scope.getOrders = function(){
            var body = {
                type: 'getOrder',
                currentUser: currentUser
            };
            RetrieveInventory.load(body, function(response){
                _.each(response, function(o){
                    $scope.data.orders.push({'user': currentUser, 'index': o.index})
                });
                $scope.data.view = 'existingOrders';
            });
        };
        $scope.newOrders = function(){
            var body = {
                type: 'getIndex'
            };
            RetrieveInventory.load(body, function(response){
                $modalInstance.close({'message': 'neworder', 'data': response[0]});
            });
        };
        $scope.back = function(){
            $scope.data.view = 'selection';
            $scope.data.orders = [];
        };
        $scope.cancel = function() {
            $modalInstance.close({'message': 'no'});
        };

        $scope.initFTScroller = function(id) {
            console.log('Init scroller=' + id);
            var containerElement = document.getElementById(id);
            console.log(containerElement);
            setTimeout(function() {
                var scroller = new FTScroller(containerElement, {
                    //contentHeight: 800,
                    alwaysScroll: true,
                    scrollingX: false,
                    scrollingY: true
                });
            }, 100);
        };
    }
);
