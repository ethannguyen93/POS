'use strict';

angular.module('admin').controller('Settings.AdminController', [
    '$scope', 'AdminPageServices',
    function ($scope, AdminPageServices) {

        // Initialize - $scope.admin is inherited from AdminController
        $scope.admin.page = 'setting';
        $scope.admin.setting.isError = false;
        $scope.admin.setting.errorMessage = '';
        $scope.admin.setting.newpasscode = '';
        $scope.admin.setting.newpasscode_repeat = '';

        $scope.changepassword = function () {
            AdminPageServices.changepassword($scope, $scope.admin.setting.passcode, $scope.admin.setting.newpasscode, $scope.admin.setting.newpasscode_repeat)
        };

        $scope.admin.setting.onchange = function () {
            $scope.admin.setting.isError = false;
            $scope.admin.setting.errorMessage = '';
        };

    }]);
