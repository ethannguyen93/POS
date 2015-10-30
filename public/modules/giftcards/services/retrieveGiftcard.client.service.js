'use strict';

angular.module('giftcards').factory('RetrieveGiftcard', [ '$resource',
	function($resource) {
		return $resource('giftcards/load', {}, {
			load: {
				method: 'POST',
				isArray: true
			}
		});
	}
]);
