'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
            state('core.scheduler', {
                url: 'scheduler',
                controller: 'SchedulerController',
                templateUrl: 'modules/scheduler/views/partials/scheduler.client.view.html'
            })
    }
]);
