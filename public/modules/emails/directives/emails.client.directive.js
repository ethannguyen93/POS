'use strict';

angular.module('emails')

    .directive('htmlTemplate', [
        function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'modules/emails/views/template.client.view.html'
            };
        }
    ]);
