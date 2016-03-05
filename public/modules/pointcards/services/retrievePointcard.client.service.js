'use strict';

angular.module('pointcards').factory('RetrievePointcard', [ '$resource',
	function($resource) {
		return $resource('pointcards/load', {}, {
			load: {
				method: 'POST',
				isArray: true
			}
		});
	}
]);
