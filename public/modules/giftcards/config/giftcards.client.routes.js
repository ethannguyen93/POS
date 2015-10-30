'use strict';

//Setting up route
angular.module('giftcards').config(['$stateProvider',
	function($stateProvider) {
		// Giftcards state routing
		$stateProvider.
		state('listGiftcards', {
			url: '/giftcards',
			templateUrl: 'modules/giftcards/views/list-giftcards.client.view.html'
		}).
		state('createGiftcard', {
			url: '/giftcards/create',
			templateUrl: 'modules/giftcards/views/create-giftcard.client.view.html'
		}).
		state('viewGiftcard', {
			url: '/giftcards/:giftcardId',
			templateUrl: 'modules/giftcards/views/view-giftcard.client.view.html'
		}).
		state('editGiftcard', {
			url: '/giftcards/:giftcardId/edit',
			templateUrl: 'modules/giftcards/views/edit-giftcard.client.view.html'
		});
	}
]);