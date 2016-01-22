'use strict';

angular.module('customers').factory('RetrieveCustomer', [ '$resource',
	function($resource) {
		return $resource('customers/load', {}, {
			load: {
				method: 'POST',
				isArray: true
			}
		});
	}
]);
