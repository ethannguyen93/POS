'use strict';

//Setting up route
angular.module('stocks').config(['$stateProvider',
	function($stateProvider) {
		// Stocks state routing
		$stateProvider.
		state('listStocks', {
			url: '/stocks',
			templateUrl: 'modules/stocks/views/list-stocks.client.view.html'
		}).
		state('createStock', {
			url: '/stocks/create',
			templateUrl: 'modules/stocks/views/create-stock.client.view.html'
		}).
		state('viewStock', {
			url: '/stocks/:stockId',
			templateUrl: 'modules/stocks/views/view-stock.client.view.html'
		}).
		state('editStock', {
			url: '/stocks/:stockId/edit',
			templateUrl: 'modules/stocks/views/edit-stock.client.view.html'
		});
	}
]);