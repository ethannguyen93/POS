'use strict';

angular.module('employees').factory('RetrieveInventory', [ '$resource',
	function($resource) {
		return $resource('inventories/load', {}, {
			load: {
				method: 'POST',
				isArray: true
			}
		});
	}
]);
