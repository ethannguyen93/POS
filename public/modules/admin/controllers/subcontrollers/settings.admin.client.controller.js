'use strict';

angular.module('admin').controller('Settings.AdminController', [
    '$scope', 'AdminPageServices', 'RetrieveInventory',
    function ($scope, AdminPageServices, RetrieveInventory) {

        // Initialize - $scope.admin is inherited from AdminController
        $scope.admin.page = 'setting';
        $scope.admin.setting.isError = false;
        $scope.admin.setting.errorMessage = '';
        $scope.admin.setting.newpasscode = '';
        $scope.admin.setting.newpasscode_repeat = '';
        $scope.orderId = '';
        $scope.voidSuccess = false;
        $scope.changepassword = function () {
            AdminPageServices.changepassword($scope, $scope.admin.setting.passcode, $scope.admin.setting.newpasscode, $scope.admin.setting.newpasscode_repeat)
        };

        $scope.admin.setting.onchange = function () {
            $scope.voidSuccess = false;
            $scope.admin.setting.isError = false;
            $scope.admin.setting.errorMessage = '';
        };
        $scope.voidOrder = function(){
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            if (!checkForHexRegExp.test($scope.orderId)){
                $scope.admin.setting.isError = true;
                $scope.admin.setting.errorMessage = 'Please enter a valid order ID';
            }else{
                var body = {
                    type: 'voidOrder',
                    orderId: $scope.orderId
                };
                RetrieveInventory.load(body, function(response){
                    if (response[0] === 'Updated'){
                        $scope.admin.setting.isError = true;
                        $scope.voidSuccess = true;
                        $scope.admin.setting.errorMessage = 'Voided order';
                    }else{
                        $scope.admin.setting.isError = true;
                        $scope.admin.setting.errorMessage = 'Can\'t find this order';
                    }
                });
            }
        };
    }]);
