'use strict';

angular.module('admin').controller('Reports.AdminController', ['$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$modal', 'Config',
    function ($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
              LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $modal, Config) {
        $scope.exportType = ['PDF', 'CSV'];
        $scope.exportTypeSelected = 'PDF';
        // Init - $scope.admin inherited from AdminController
        $scope.admin.report.pdf = undefined;
        $scope.config = Config;
        $scope.selectCustomer = function () {
            $scope.selectCustomerModal().then(function (customer) {
                if (customer !== undefined) {
                    $scope.admin.report.customer.id = customer._id;
                    $scope.admin.report.customer.name = customer.name;
                }
            });
        };
        $scope.selectCustomerModal = function () {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-expand',
                templateUrl: 'modules/admin/views/partials/modal/selectCustomerModal.client.view.html',
                controller: 'selectCustomerAdminController'
            });
            editorInstance.result.then(function (customer) {
                deferred.resolve(customer);
            });
            return deferred.promise;
        };
        $scope.initReport = function () {
            var body = {
                type: 'getAll'
            };
            RetrieveEmployee.load(body, function (response) {
                $scope.admin.report.employees = response;
                $scope.admin.report.date = new Date();
                $scope.admin.report.open = false;
            });
        };
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.clear = function () {
            $scope.dt = null;
        };
        $scope.open = function ($event) {
            $scope.admin.report.open = !$scope.admin.report.open;
        };
        $scope.generateReport = function () {
            console.log('creating reports');
            var body = {
                'type': 'getReport',
                'reportType': $scope.admin.report.selectedOption,
                'giftcardNum': $scope.admin.report.giftcardNum,
                'itemBarcode': $scope.admin.report.itemBarcode,
                'customerID': $scope.admin.report.customer.id,
                'employeeName': $scope.admin.report.selectedEmployee,
                date: $scope.admin.report.date,
                exportType: $scope.exportTypeSelected
            };
            console.log('generating report');
            $scope.admin.report.pdf = undefined;
            RetrieveInventory.load(body, function (response) {
                $scope.admin.report.pdf = response[0].pdf;
                console.log('getReport');
            })
        };

    }]);
