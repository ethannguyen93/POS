'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
            /*state('admin', {
             url: '/admin',
             controller: 'AdminController'
             templateUrl: 'modules/admin/views/admin.client.view.html'
             })*/

            state('core.admin', {
                url: 'admin',
                abstract: true,
                template: '<ui-view/>'
            })
                .state('core.admin.login', {
                    url: '/login',
                    controller: 'AdminLoginController',
                    templateUrl: 'modules/admin/views/partials/adminpageLogin.client.view.html'
                })
                .state('core.admin.authenticated', {
                    url: '/dashboard',
                    controller: 'AdminController',
                    params: {user: null},
                    templateUrl: 'modules/admin/views/admin.client.view.html'
                })
    }
]);
