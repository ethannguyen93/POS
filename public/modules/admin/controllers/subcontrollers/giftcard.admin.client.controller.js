'use strict';

angular.module('admin').controller('Giftcard.AdminController', ['$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', 'Modals',
    function ($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
              LoginpageService, $q, AdminLoginPageServices, AdminPageServices, Modals) {

        // Init - $scope.admin inherited from AdminController
        $scope.admin.giftcard.newgc = '';
        $scope.admin.item.newgcprice = '';
        $scope.admin.item.errorMessage = '';
        $scope.admin.item.isError = false;
        AdminPageServices.getAll($scope, 'giftcard');

        $scope.removeGiftcard = function(gcNum) {
            Modals.openDeleteModal().then(function(result) {
                if (result === 'yes') {
                    AdminPageServices.remove($scope, { number: gcNum }, 'giftcard');
                }
            });
        };

        $scope.admin.giftcard.gridOptions.onRegisterApi = function (gridApi) {
            $scope.admin.giftcard.gridApi = gridApi;
        };
        $scope.admin.giftcard.onchange = function () {
            $scope.admin.giftcard.isError = false;
            $scope.admin.giftcard.errorMessage = '';
        };
        $scope.initGiftcard = function () {
            $scope.getAll('giftcard').then(function () {
                $scope.admin.giftcard.gridOptions.columnDefs = [
                    {
                        name: 'Gift card number',
                        field: 'number'
                    },
                    {
                        name: 'Balance',
                        enableFiltering: false,
                        cellFilter: 'priceFilter',
                        field: 'amount'
                    },
                    {
                        name: 'Remove',
                        enableFiltering: false,
                        cellTemplate: '<a href="" ng-click="grid.appScope.removeGiftcard(row.entity.number)"' +
                        '><span class="glyphicon glyphicon-remove"></span></a>'
                    }
                ];
            });
        };

    }]);
