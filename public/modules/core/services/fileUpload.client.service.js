'use strict';

angular.module('core')
	.factory('UploadService', [ '$resource',
		function($resource) {
			return $resource('upload/stocks', {}, {
				load: {
					method: 'POST',
					isArray: true
				}
			});
		}
	]);
