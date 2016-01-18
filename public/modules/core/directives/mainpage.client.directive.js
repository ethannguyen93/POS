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
	.directive('keyboard', [
		function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'modules/core/views/partials/keyboard.client.view.html'
			};
		}
	]);

