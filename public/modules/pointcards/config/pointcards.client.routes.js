'use strict';

//Setting up route
angular.module('pointcards').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Customers state routing
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('core.pointcard', {
			url: 'pointcard',
			controller: 'PointcardsController',
			templateUrl: 'modules/pointcards/views/pointcard.client.view.html'
		})
	}
]);
