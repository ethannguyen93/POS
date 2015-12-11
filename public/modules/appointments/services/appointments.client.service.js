'use strict';

//Appointments service used to communicate Appointments REST endpoints
angular.module('appointments').factory('RetrieveAppointments', ['$resource',
	function($resource) {
		return $resource('appointments/load', {}, {
			load: {
				method: 'POST',
				isArray: true
			}
		});
	}
]);

