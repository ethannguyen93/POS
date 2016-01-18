'use strict';

angular.module('admin')
    .directive('adminEmployee', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'modules/admin/views/partials/admin/employee.client.view.html'
            };
        }
    ])
    .directive('adminSetting', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'modules/admin/views/partials/admin/setting.client.view.html'
            };
        }
    ])
    .directive('adminCategory', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'modules/admin/views/partials/admin/category.client.view.html'
            };
        }
    ])
    .directive('adminItem', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'modules/admin/views/partials/admin/item.client.view.html'
            };
        }
    ])
    .directive('adminGiftcard', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'modules/admin/views/partials/admin/giftcard.client.view.html'
            };
        }
    ])
    .directive('adminReport', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'modules/admin/views/partials/admin/report.client.view.html'
            };
        }
    ]);
