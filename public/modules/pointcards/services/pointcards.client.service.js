'use strict';

//Pointcards service used to communicate Pointcards REST endpoints
angular.module('pointcards').factory('Pointcards', ['$resource',
	function($resource) {
		return $resource('pointcards/:pointcardId', { pointcardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);