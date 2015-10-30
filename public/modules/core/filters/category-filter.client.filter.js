'use strict';

angular.module('core').filter('categoryFilter', [
	function() {
		return function(input, categories) {
			if (!input){
				return '';
			}else{
				var item = _.find(categories, function(c){
					return c.name === input;
				});
				if (item === undefined){
					return ''
				}else{
					return item.name;
				}
			}
		};
	}
]);
