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

                // Login State
                .state('core.admin.login', {
                    url: '/login',
                    controller: 'AdminLoginController',
                    templateUrl: 'modules/admin/views/partials/adminpageLogin.client.view.html'
                })

                // Authenticated State
                .state('core.admin.authenticated', {
                    url: '/dashboard',
                    controller: 'AdminController',
                    params: {user: null},
                    templateUrl: 'modules/admin/views/admin.client.view.html'
                })
                    .state('core.admin.authenticated.settings', {
                        url: '/settings',
                        views: {
                            'admin-content': {
                                controller: 'Settings.AdminController',
                                params: {user: null},
                                templateUrl: 'modules/admin/views/subviews/settings.admin.client.view.html'
                            }
                        }
                    })
                    .state('core.admin.authenticated.employee', {
                        url: '/employee',
                        views: {
                            'admin-content': {
                                controller: 'Employee.AdminController',
                                params: {user: null},
                                templateUrl: 'modules/admin/views/subviews/employee.admin.client.view.html'
                            }
                        }
                    })
                    .state('core.admin.authenticated.categories', {
                        url: '/categories',
                        views: {
                            'admin-content': {
                                controller: 'Categories.AdminController',
                                params: {user: null},
                                templateUrl: 'modules/admin/views/subviews/categories.admin.client.view.html'
                            }
                        }
                    })
                    .state('core.admin.authenticated.items', {
                        url: '/items',
                        views: {
                            'admin-content': {
                                controller: 'Items.AdminController',
                                params: {user: null},
                                templateUrl: 'modules/admin/views/subviews/items.admin.client.view.html'
                            }
                        }
                    })
                    .state('core.admin.authenticated.giftcard', {
                        url: '/giftcard',
                        views: {
                            'admin-content': {
                                controller: 'Giftcard.AdminController',
                                params: {user: null},
                                templateUrl: 'modules/admin/views/subviews/giftcard.admin.client.view.html'
                            }
                        }
                    })
                    .state('core.admin.authenticated.reports', {
                        url: '/reports',
                        views: {
                            'admin-content': {
                                controller: 'Reports.AdminController',
                                params: {user: null},
                                templateUrl: 'modules/admin/views/subviews/reports.admin.client.view.html'
                            }
                        }
                    })
    }
]);
