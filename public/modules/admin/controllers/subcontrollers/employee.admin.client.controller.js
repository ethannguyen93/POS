'use strict';

angular.module('admin').controller('Employee.AdminController', ['$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$modal', 'Modals',
    function ($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
              LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $modal, Modals) {

        // Init - $scope.admin inherited from AdminController
        $scope.admin.employee.newemployeename = '';
        $scope.admin.employee.newemployeepasscode = '';
        $scope.admin.employee.errorMessage = '';
        $scope.admin.employee.isError = false;
        AdminPageServices.getAll($scope, 'employee');

        $scope.admin.employee.gridOptions.onRegisterApi = function (gridApi) {
            $scope.admin.employee.gridApi = gridApi;
            gridApi.edit.on.beginCellEdit($scope, function () {
                $scope.admin.employee.isError = false;
                $scope.admin.employee.errorMessage = '';
            });
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                var regex = new RegExp("^[A-Za-z0-9]+$");
                if (!regex.test(newValue)) {
                    $scope.admin.employee.isError = true;
                    $scope.admin.employee.errorMessage = 'This employee name is invalid';
                    rowEntity.name = oldValue;
                } else {
                    var tmp = _.filter($scope.admin.employee.employees, function (e) {
                        return e.name === newValue
                    });
                    if (tmp.length > 1) {
                        $scope.admin.employee.isError = true;
                        $scope.admin.employee.errorMessage = 'This employee is already existed';
                        rowEntity.name = oldValue;
                    } else {
                        var data = {
                            newName: newValue,
                            oldName: oldValue,
                            passcode: _.find($scope.admin.employee.employees, function (e) {
                                return e.name === newValue
                            }).passcode
                        };
                        AdminPageServices.rename($scope, data, 'employee');
                    }
                }
            });
        };
        $scope.admin.employee.changePasscode = function (passcode) {
            $scope.admin.employee.changeEmployeePasscodeModal(passcode).then(function () {
                $scope.getAll('employee');
            });
        };
        $scope.admin.employee.changeEmployeePasscodeModal = function (passcode) {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/core/views/changePasscodeModal.client.view.html',
                controller: 'changePasscodeCtrl',
                resolve: {
                    oldPasscode: function () {
                        return passcode;
                    }
                }
            });
            editorInstance.result.then(function () {
                deferred.resolve();
            });
            return deferred.promise;
        };

        $scope.initEmployee = function () {
            $scope.getAll('employee').then(function () {
                $scope.admin.employee.gridOptions.columnDefs = [
                    {
                        name: 'Employee name',
                        field: 'name',
                        footerCellTemplate: '<input ng-model="grid.appScope.admin.employee.newemployeename" ' +
                        'ng-change="grid.appScope.admin.employee.onchange()" placeholder="Enter new employee name" ng-pattern="/^[A-Za-z0-9]+$/"/>',
                        enableCellEdit: true
                    },
                    {
                        name: 'Passcode',
                        field: 'passcode',
                        enableFiltering: false,
                        footerCellTemplate: '<input ng-model="grid.appScope.admin.employee.newemployeepasscode" ' +
                        'ng-change="grid.appScope.admin.employee.onchange()" placeholder="Enter new employee passcode" ng-pattern="/^[0-9]{4}$/"/>',
                        enableCellEdit: false
                    },
                    {
                        name: 'Change Password',
                        field: 'passcode',
                        cellTemplate: '<button type="button" class="btn btn-info btn-block" ng-click="grid.appScope.admin.employee.changePasscode(row.entity.passcode)">Change password</button>',
                        enableFiltering: false,
                        enableCellEdit: false
                    },
                    {
                        name: 'Add/Remove',
                        enableFiltering: false,
                        cellTemplate: '<a href="" ng-click="grid.appScope.removeEmployee(row.entity.passcode, row.entity.name)"' +
                        '><span class="glyphicon glyphicon-remove"></span></a>',
                        enableCellEdit: false,
                        footerCellTemplate: '<a href="" ng-click="grid.appScope.addEmployee()"> <span class="glyphicon glyphicon-plus"></span> </a>'
                    }
                ];
            });
        };
        $scope.removeEmployee = function (passcode, name) {
            var data = {
                passcode: passcode,
                name: name
            };
            Modals.openDeleteModal().then(function(result) {
                if (result === 'yes') {
                    AdminPageServices.remove($scope, data, 'employee');
                }
            });
        };
        $scope.admin.employee.onchange = function () {
            $scope.admin.employee.isError = false;
            $scope.admin.employee.errorMessage = '';
        };
        $scope.addEmployee = function () {
            if ($scope.admin.employee.newemployeename === undefined ||
                $scope.admin.employee.newemployeepasscode === undefined ||
                $scope.admin.employee.newemployeename === '' ||
                $scope.admin.employee.newemployeepasscode === '') {
                $scope.admin.employee.isError = true;
                $scope.admin.employee.errorMessage = 'Please fill both name and passcode';
            } else if (_.find($scope.admin.employee.employees, function (e) {
                    return $scope.admin.employee.newemployeename === e.name
                }) !== undefined) {
                $scope.admin.employee.isError = true;
                $scope.admin.employee.errorMessage = 'This name is already taken';
            } else if (_.find($scope.admin.employee.employees, function (e) {
                    return $scope.admin.employee.newemployeepasscode === e.passcode
                }) !== undefined) {
                $scope.admin.employee.isError = true;
                $scope.admin.employee.errorMessage = 'This passcode is already taken';
            } else {
                var data = {
                    passcode: $scope.admin.employee.newemployeepasscode,
                    name: $scope.admin.employee.newemployeename
                };
                AdminPageServices.add($scope, data, 'employee');
                $scope.admin.employee.newemployeename = '';
                $scope.admin.employee.newemployeepasscode = '';
            }
        };
    }]);
