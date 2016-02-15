'use strict';

angular.module('admin').controller('Items.AdminController', ['$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices',
    function ($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
              LoginpageService, $q, AdminLoginPageServices, AdminPageServices) {

        // Init - $scope.admin inherited from AdminController
        $scope.admin.item.newcat = '';
        $scope.admin.item.errorMessage = '';
        $scope.admin.item.isError = false;
        $scope.admin.item.newitemname = '';
        $scope.admin.item.newitemprice = '';
        AdminPageServices.getAll($scope, 'item');

        $scope.removeItem = function (name, category, price) {
            var data = {
                name: name,
                category: category,
                price: price
            };
            AdminPageServices.remove($scope, data, 'item');
        };
        $scope.addItem = function () {
            if ($scope.admin.item.newitemname === undefined ||
                $scope.admin.item.newitemname === '' ||
                $scope.admin.item.newcat === undefined ||
                $scope.admin.item.newcat === '' ||
                $scope.admin.item.newitemprice === undefined ||
                $scope.admin.item.newitemprice === ''
            ) {
                $scope.admin.item.isError = true;
                $scope.admin.item.errorMessage = 'Please fill all box below';
            } else if (_.find($scope.admin.item.items, function (item) {
                    return $scope.admin.item.newitemname === item.name
                        && $scope.admin.item.newcat === item.cat
                        && $scope.admin.item.newitemprice === item.price
                }) === undefined) {
                var data = {
                    name: $scope.admin.item.newitemname,
                    category: $scope.admin.item.newcat.name,
                    price: parseFloat($scope.admin.item.newitemprice)
                };
                AdminPageServices.add($scope, data, 'item').then(function () {
                    $scope.admin.item.newcat = '';
                    $scope.admin.item.newitemname = '';
                    $scope.admin.item.newitemprice = '';
                });
            } else {
                $scope.admin.category.isError = true;
                $scope.admin.category.errorMessage = 'This item is already existed';
            }
        };
        $scope.admin.item.onchange = function () {
            $scope.admin.item.isError = false;
            $scope.admin.item.errorMessage = '';
        };
        $scope.admin.item.gridOptions.onRegisterApi = function (gridApi) {
            $scope.admin.item.gridApi = gridApi;
            gridApi.edit.on.beginCellEdit($scope, function () {
                $scope.admin.category.isError = false;
                $scope.admin.category.errorMessage = '';
            });
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                var field = colDef.field;
                var tmp = _.filter($scope.admin.item.items, function (item) {
                    return (item.name === rowEntity.name
                    && item.category === rowEntity.category
                    && item.price === rowEntity.price)
                });
                if (tmp.length > 1) {
                    $scope.admin.item.isError = true;
                    $scope.admin.item.errorMessage = 'This item is already existed';
                    rowEntity[field] = oldValue;
                } else {
                    var data = {
                        newValue: newValue,
                        oldValue: oldValue,
                        field: field,
                        item: rowEntity
                    };
                    AdminPageServices.updateItem($scope, data, 'item');
                }
            });
        };
        $scope.initItem = function () {
            $scope.getAll('item').then(function () {
                $scope.admin.item.gridOptions.columnDefs = [
                    {
                        name: 'Item name',
                        field: 'name',
                        footerCellTemplate: '<input ng-model="grid.appScope.admin.item.newitemname" ' +
                        'ng-change="grid.appScope.admin.item.onchange()" placeholder="Enter new item name"ng-pattern="/^.+$/"/>',
                        enableCellEdit: true
                    },
                    {
                        name: 'Category name',
                        field: 'category',
                        footerCellTemplate: '<select class="form-control" ng-model="grid.appScope.admin.item.newcat" ng-change="grid.appScope.admin.item.onchange()" ng-options="category as category.name for category in grid.appScope.admin.category.categories"></select>',
                        enableCellEdit: false
                        /*cellFilter: 'categoryFilter:grid.appScope.admin.category.categories',*/
                        /*editDropdownValueLabel: 'name',
                         editableCellTemplate: 'ui-grid/dropdownEditor',
                         editDropdownOptionsArray: $scope.admin.category.categories*/
                    },
                    {
                        name: 'Price',
                        field: 'price',
                        cellFilter: 'priceFilter',
                        footerCellTemplate: '<input ng-model="grid.appScope.admin.item.newitemprice" ' +
                        'ng-change="grid.appScope.admin.item.onchange()" placeholder="Enter new price" ng-pattern="/(^[0-9]+$)|(^[0-9]+[.]{1}[0-9]+$)/"/>'
                    },
                    {
                        name: 'Add/Remove',
                        enableFiltering: false,
                        cellTemplate: '<a href="" ng-click="grid.appScope.removeItem(row.entity.name, row.entity.category, row.entity.price)"' +
                        '><span class="glyphicon glyphicon-remove"></span></a>',
                        enableCellEdit: false,
                        footerCellTemplate: '<a href="" ng-click="grid.appScope.addItem()"> <span class="glyphicon glyphicon-plus"></span> </a>'
                    }
                ];
            });
        };

    }]);
