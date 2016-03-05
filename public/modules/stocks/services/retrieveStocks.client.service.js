'use strict';

angular.module('stocks')
	.factory('RetrieveStock', [ '$resource',
	function($resource) {
		return $resource('stocks/load', {}, {
			load: {
				method: 'POST',
				isArray: true
			}
		});
	}
	]);
