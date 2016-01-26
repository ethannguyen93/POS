'use strict';

// Workflows controller
angular.module('core').controller('selectCustomerCoreController', [
    '$scope', '$modalInstance', 'RetrieveCustomer', '$q', '$modal',
    function ($scope, $modalInstance, RetrieveCustomer, $q, $modal) {
        $scope.gridOptions = {
            rowHeight: 60,
            columnFooterHeight: 60,
            showColumnFooter: true,
            enableFiltering: true,
            enablePaginationControls: false,
            paginationPageSize: 10,
            data: 'data.customers'
        };

        $scope.data = {
            customers: [],
            isError: false,
            errorMessage: '',
            new: {
                name: '',
                phone: '',
                email: ''
            }
        };
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.addCustomer = function(){
            if ($scope.data.new.name === ''){
                $scope.data.isError = true;
                $scope.data.errorMessage = 'Please enter customer name';
            }else if ($scope.data.new.phone === '' && $scope.data.new.email === '') {
                $scope.data.isError = true;
                $scope.data.errorMessage = 'Please enter either phone number or email address';
            }else{
                var body = {
                    type: 'getCustomer',
                    name: $scope.data.new.name,
                    phone: $scope.data.new.phone,
                    email: $scope.data.new.email
                };
                RetrieveCustomer.load(body, function(response){
                    if (response[0].name === undefined){
                        body.type = 'addCustomer';
                        RetrieveCustomer.load(body, function(response){
                            $scope.data.customers.push(response[0]);
                        });
                        $scope.data.new = {
                            name: '',
                            phone: '',
                            email: ''
                        }
                    }else{
                        $scope.data.isError = true;
                        $scope.data.errorMessage = 'Customer is already existed';
                    }
                })
            }
        };

        $scope.initCustomer = (function(){
            $scope.gridOptions.columnDefs = [
                {
                    name: 'Name',
                    field: 'name',
                    footerCellTemplate: '<input ng-model="grid.appScope.data.new.name" ' +
                    'ng-change="grid.appScope.reset()" placeholder="New name"/>'
                },
                {
                    name: 'Phone',
                    field: 'phone',
                    footerCellTemplate: '<input ng-model="grid.appScope.data.new.phone" ' +
                    'ng-change="grid.appScope.reset()" placeholder="New phone number"/>'
                },
                {
                    name: 'Email',
                    field: 'email',
                    footerCellTemplate: '<input ng-model="grid.appScope.data.new.email" ' +
                    'ng-change="grid.appScope.reset()" placeholder="New email address"/>'
                },
                {
                    name: 'Edit',
                    enableFiltering: false,
                    cellTemplate: '<a href="" ng-click="grid.appScope.editCustomer(row.entity.name, row.entity.phone, row.entity.email, row.entity._id)"' +
                    '><span class="glyphicon glyphicon-pencil"></span></a>'
                },
                {
                    name: 'Add/Select',
                    enableFiltering: false,
                    cellTemplate: '<a href="" ng-click="grid.appScope.selectCustomer(row.entity._id)"' +
                    '><span class="glyphicon glyphicon-ok"></span></a>',
                    footerCellTemplate: '<a href="" ng-click="grid.appScope.addCustomer()"> <span class="glyphicon glyphicon-plus"></span> </a>'
                }
            ];
            var body = {
                type: 'getAll'
            };
            RetrieveCustomer.load(body, function(response){
                $scope.data.customers = [];
                _.each(response, function(customer){
                    $scope.data.customers.push(customer);
                });
            });
        })();
        $scope.editCustomer = function(name, phone, email, id){
            $scope.editCustomerModal(name, phone, email, id).then(function(customer){
                if (customer !== undefined){
                    var c = _.find($scope.data.customers, function(c){
                        return customer.id === c._id;
                    });
                    c.name = customer.name;
                    c.phone = customer.phone;
                    c.email = customer.email;
                };
            });
        };
        $scope.editCustomerModal = function (name, phone, email, id) {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/customers/views/modal/editCustomerModal.client.view.html',
                controller: 'editCustomerController',
                resolve: {
                    customer: function() {
                        return {id: id, name: name, phone: phone, email: email}
                    }
                }
            });
            editorInstance.result.then(function (customer) {
                deferred.resolve(customer);
            });
            return deferred.promise;
        };
        $scope.selectCustomer = function(id){
            var c = _.find($scope.data.customers, function(c){
                return id === c._id;
            });
            $modalInstance.close(c);
        };
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };
        $scope.initFTScrollerGrid = function(id) {
            setTimeout(function () {
                var containerElement = document.querySelector("#" + id + " .ui-grid-viewport");
                var scroller = new FTScroller(containerElement, {
                    alwaysScroll: true,
                    scrollingX: false
                });
            }, 100);
        };
        $scope.cancel = function(){
            $modalInstance.close();
        };
    }]
);
