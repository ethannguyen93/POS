'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		/*state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		})
		*/

        state('core', {
            abstract: true,
            url: '/',
            // Note: abstract still needs a ui-view for its children to populate.
            // You can simply add it inline here.
            templateUrl: 'modules/core/views/home.client.view.html'
        })
        .state('core.login', {
            url: '',
            template: '<num-pad></num-pad>'
        })
        .state('core.authenticated', {
            url: 'pos',
            params: {user: null},
            template: '<main-page></main-page>'
        })

	}
]);
