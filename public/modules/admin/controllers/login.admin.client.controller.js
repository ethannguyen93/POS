'use strict';

angular.module('admin').controller('AdminLoginController', [
    '$scope','AdminLoginPageServices',
    function($scope, AdminLoginPageServices) {
    /*Admin Login Page*/
    $scope.adminLogin = {
        password: ''
    };
    $scope.keyboard = {
        shift: 'shift-off',
        keyboard:{
            shiftoff:{
                firstline: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
                secondline: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
                thirdline: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
                forthline: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.','/']
            },
            shifton:{
                firstline: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
                secondline: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}'],
                thirdline: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"'],
                forthline: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>','?']
            },
            tabon:{
                firstline: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
                secondline: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
                thirdline: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\''],
                forthline: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.','/']
            }
        }
    };
    $scope.enter = function(key){
        AdminLoginPageServices.enterpassword($scope, key);
    };
}]);
