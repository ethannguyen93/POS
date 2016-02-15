'use strict';

angular.module('admin').controller('Categories.AdminController', ['$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices',
    function ($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
              LoginpageService, $q, AdminLoginPageServices, AdminPageServices) {
        // Init - $scope.admin inherited from AdminController
        $scope.admin.category.newcategoryname = '';
        $scope.admin.category.errorMessage = '';
        $scope.admin.category.isError = false;
        AdminPageServices.getAll($scope, 'category');

        $scope.removeCategory = function (name) {
            var data = {
                name: name
            };
            AdminPageServices.remove($scope, data, 'category');
        };
        $scope.addCategory = function () {
            if ($scope.admin.category.newcategoryname === undefined || $scope.admin.category.newcategoryname === '') {
                $scope.admin.category.isError = true;
                $scope.admin.category.errorMessage = 'Please enter category name';
            } else if (_.find($scope.admin.category.categories, function (cat) {
                    return $scope.admin.category.newcategoryname === cat.name
                }) === undefined) {
                var data = {
                    name: $scope.admin.category.newcategoryname
                };
                AdminPageServices.add($scope, data, 'category').then(function () {
                    $scope.admin.category.newcategoryname = '';
                });
            } else {
                $scope.admin.category.isError = true;
                $scope.admin.category.errorMessage = 'This category is already existed';
            }
        };
        $scope.admin.category.gridOptions.onRegisterApi = function (gridApi) {
            $scope.admin.category.gridApi = gridApi;
            gridApi.edit.on.beginCellEdit($scope, function () {
                $scope.admin.category.isError = false;
                $scope.admin.category.errorMessage = '';
            });
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                var regex = new RegExp("^[A-Za-z0-9]+$");
                if (!regex.test(newValue)) {
                    $scope.admin.category.isError = true;
                    $scope.admin.category.errorMessage = 'This category name is invalid';
                    rowEntity.name = oldValue;
                } else {
                    var tmp = _.filter($scope.admin.category.categories, function (cat) {
                        return cat.name === newValue
                    });
                    if (tmp.length > 1) {
                        $scope.admin.category.isError = true;
                        $scope.admin.category.errorMessage = 'This category is already existed';
                        rowEntity.name = oldValue;
                    } else {
                        var data = {
                            newName: newValue,
                            oldName: oldValue
                        };
                        AdminPageServices.rename($scope, data, 'category');
                    }
                }
            });
        };
        $scope.admin.category.onchange = function () {
            $scope.admin.category.isError = false;
            $scope.admin.category.errorMessage = '';
        };
        $scope.initCategory = function () {
            $scope.getAll('category').then(function () {
                $scope.admin.category.gridOptions.columnDefs = [
                    {
                        name: 'Category name',
                        field: 'name',
                        footerCellTemplate: '<input ng-model="grid.appScope.admin.category.newcategoryname" ' +
                        'ng-change="grid.appScope.admin.category.onchange()" placeholder="Enter new category name"ng-pattern="/^[A-Za-z0-9]+$/"/>',
                        enableCellEdit: true
                    },
                    {
                        name: 'Add/Remove',
                        enableFiltering: false,
                        cellTemplate: '<a href="" ng-click="grid.appScope.removeCategory(row.entity.name)"' +
                        '><span class="glyphicon glyphicon-remove"></span></a>',
                        enableCellEdit: false,
                        footerCellTemplate: '<a href="" ng-click="grid.appScope.addCategory()"> <span class="glyphicon glyphicon-plus"></span> </a>'
                    }
                ];
            });
        };
    }]);
