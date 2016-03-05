'use strict';

angular.module('core').factory('hidScanner', function($rootScope, $window, $timeout) {
    return {
        initialize : function($scope) {
            var chars = [];
            var pressed = false;
            angular.element($window).on('keypress', function(e){
                if (e.which >= 48 && e.which <= 57) {
                    chars.push(String.fromCharCode(e.which));
                }
                if (pressed == false) {
                    $timeout(function(){
                        if (chars.length >= 6) {
                            var barcode = chars.join("");
                            $scope.$broadcast("hidScanner::scanned", {barcode: barcode});
                        }
                        chars = [];
                        pressed = false;
                    },250);
                }
                pressed = true;
            });
        },
        destroy: function(){
            angular.element($window).off('keypress');
        }
    };
});
