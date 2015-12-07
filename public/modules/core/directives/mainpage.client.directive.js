'use strict';

angular.module('core')

	.directive('numPad', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/numpad.client.view.html'
			};
		}
	])
	.directive('mainPage', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/mainpage.client.view.html'
			};
		}
	])
	.directive('schedulerPage', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/scheduler.client.view.html'
			};
		}
	])
	.directive('adminPagelogin', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/adminpageLogin.client.view.html'
			};
		}
	])
	.directive('adminPage', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/adminpage.client.view.html'
			};
		}
	])
	.directive('keyboard', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/keyboard.client.view.html'
			};
		}
	])
	.directive('adminEmployee', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/admin/employee.client.view.html'
			};
		}
	])
	.directive('adminSetting', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/admin/setting.client.view.html'
			};
		}
	])
	.directive('adminCategory', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/admin/category.client.view.html'
			};
		}
	])
	.directive('adminItem', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/admin/item.client.view.html'
			};
		}
	])
	.directive('adminGiftcard', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/admin/giftcard.client.view.html'
			};
		}
	])
	.directive('adminReport', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/admin/report.client.view.html'
			};
		}
	]);

