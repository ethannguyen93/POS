'use strict';

angular.module('employees').factory('RetrieveEmployee', [ '$resource',
	function($resource) {
		return $resource('employees/load', {}, {
			load: {
				method: 'POST',
				isArray: true
			}
		});
	}
]);
