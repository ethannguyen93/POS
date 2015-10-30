'use strict';

angular.module('core').filter('priceFilter', [
	function() {
		return function(value) {
			return value.toFixed(2);
		};
	}
]);
