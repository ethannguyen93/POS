'use strict';

// Workflows controller
angular.module('core').controller('orderCtrl',
    function ($scope, UserService, $state, $stateParams, $location, $modalInstance, currentUser, 
              RetrieveInventory, $q, $modal, Config) {
        $scope.config = Config;
        $scope.data = {
            orders: [],
            view: 'selection',
            isError: false,
            errorMessage: '',
            ticketNumber: '',
            searchOptions: ['Ticket Number', 'Customer Name'],
            selectedOption: 'Customer Name',
            customerName: '',
            customerOrders: [],
            oneAtATime: true
        };
        if (!Config.SAVE_ORDER_ACTIVE && !Config.EXISTING_ORDER_ACTIVE){
            $scope.data.view = 'newOrders';
        }
        $scope.searchCustomerOrder = function(){
            if ($scope.data.customerName !== ''){
                var body = {
                    type: 'searchCustomerOrder',
                    customerName: $scope.data.customerName
                };
                RetrieveInventory.load(body, function(response){
                    _.each(response, function(order){
                        order._time = moment(order.timeOrderPlaced).format("ddd, MMM Do YYYY, h:mm:ss a");
                    });
                    $scope.data.customerOrders = response;
                });
            }else{
                $scope.data.errorMessage = 'Please enter customer name';
                $scope.data.isError = true;
            }
        };
        $scope.selectCustomerOrder = function(order){
            $modalInstance.close({'message': 'order', 'data': order});
        };
        $scope.selectOrder = function(id){
            var body = {
                type: 'selectOneOrder',
                id: id
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
                    $scope.data.orders.push({'user': UserService.getUser(), 'index': o.index, 'customerName': o.customerName, 'id': o._id})
                });
                $scope.data.view = 'existingOrders';
            });
        };
        $scope.ticketOrders = function(){
            $scope.data.view = 'ticketOrders';
        };
        $scope.getTicketOrder = function(){
            if ($scope.data.ticketNumber !== ''){
                var body = {
                    type: 'getTicketOrder',
                    ticketNumber: $scope.data.ticketNumber
                };
                RetrieveInventory.load(body, function(response){
                    if (response[0]._id !== undefined){
                        debugger;
                        $modalInstance.close({'message': 'order', 'data': response[0]});
                    }else{
                        $scope.data.errorMessage = 'This order does not exist or already paid!';
                        $scope.data.isError = true;
                    }
                });
            }else{
                $scope.data.errorMessage = 'Please enter a ticket number';
                $scope.data.isError = true;
            }
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
            if ($scope.view === 'newOrders'){
                $scope.data.newCustomer.email = '';
                $scope.data.newCustomer.phone = '';
                $scope.data.newCustomer._id = '';
            }
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
                templateUrl: 'modules/scheduler/views/modal/selectCustomerModal.client.view.html',
                controller: 'selectCustomerController'
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
