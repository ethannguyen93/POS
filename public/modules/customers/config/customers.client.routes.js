'use strict';

//Setting up route
angular.module('customers').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Customers state routing
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('core.customer', {
			url: 'customer',
			controller: 'CustomersController',
			templateUrl: 'modules/customers/views/customer.client.view.html'
		})
	}
]);
