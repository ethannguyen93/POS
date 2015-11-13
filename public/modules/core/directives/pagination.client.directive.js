'use strict';

angular.module('core')

    .directive('posPagination', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    page: '@',
                    of: '@',
                    prev: '&',
                    next: '&'
                },
                templateUrl: 'modules/core/views/partials/pagination.client.view.html'
            };
        }
    ]);

