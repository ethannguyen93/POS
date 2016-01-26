'use strict';

// Workflows controller
angular.module('core').controller('orderCtrl',
    function ($scope, UserService, $state, $stateParams, $location, $modalInstance, currentUser, RetrieveInventory, $q, $modal) {
        $scope.data = {
            orders: [],
            view: 'selection',
            isError: false,
            errorMessage: ''
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
                currentUser: UserService.getUser()
            };
            RetrieveInventory.load(body, function(response){
                _.each(response, function(o){
                    $scope.data.orders.push({'user': UserService.getUser(), 'index': o.index, 'customerName': o.customerName})
                });
                $scope.data.view = 'existingOrders';
            });
        };
        $scope.newOrders = function(){
            var body = {
                type: 'getIndex'
            };
            RetrieveInventory.load(body, function(response){
                $scope.data.view = 'newOrders';
                $scope.data.newIndex = response[0];
            });
        };
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
            $scope.data.newCustomer.email = '';
            $scope.data.newCustomer.phone = '';
            $scope.data.newCustomer._id = '';
        };
        $scope.back = function(){
            $scope.data.view = 'selection';
            $scope.data.orders = [];
        };
        $scope.selectCustomer = function(){
            $scope.selectCustomerModal().then(function(customer){
                if (customer !== undefined){
                    $scope.data.newCustomer = customer;
                }
            });
        };
        $scope.selectCustomerModal = function(){
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-expand',
                templateUrl: 'modules/core/views/modal/selectCustomerModal.client.view.html',
                controller: 'selectCustomerCoreController'
            });
            editorInstance.result.then(function (customer) {
                deferred.resolve(customer);
            });
            return deferred.promise;
        };
        $scope.done = function(){
            if ($scope.data.newCustomer === undefined){
                $scope.data.isError = true;
                $scope.data.errorMessage = 'Please enter custome\'s name';
            }else{
                $modalInstance.close({'message': 'neworder', 'data': $scope.data.newIndex, 'customer': $scope.data.newCustomer});
            }
        };
        $scope.cancel = function() {
            $modalInstance.close({'message': 'no'});
            $state.go('^.login');
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
