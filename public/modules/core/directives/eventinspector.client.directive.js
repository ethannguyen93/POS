'use strict';

angular.module('core')

    .directive('eventInspector', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    title: '@',
                    bodyVisible: '=',
                    schedulerGroup: '=',
                    scheduler: '=',
                    pickStart: '&',
                    pickEnd: '&',
                },
                templateUrl: 'modules/core/views/partials/scheduler/eventinspector.client.view.html'
            };
        }
    ]);

