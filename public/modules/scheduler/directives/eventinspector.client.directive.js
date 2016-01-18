'use strict';

angular.module('scheduler')

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
                    pickEnd: '&'
                },
                templateUrl: 'modules/scheduler/views/partials/eventinspector.client.view.html'
            };
        }
    ]);

