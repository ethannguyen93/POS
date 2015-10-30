'use strict';

// Workflows controller
angular.module('core').controller('changePasscodeCtrl',
    function ($scope, $stateParams, $location, $modalInstance, RetrieveEmployee, oldPasscode) {
        $scope.numpad = ['1','2','3','4','5','6','7','8','9'];
        $scope.data = {
            isError: false,
            errorMessage: '',
            placeholder: 'Enter new password',
            newpassword: '',
            savepassword: '',
            success: false
        };
        $scope.reset = function(){
            $scope.data.success = false;
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.setError = function(message){
            $scope.data.isError = true;
            $scope.data.errorMessage = message;
        };
        $scope.updatePasscode = function(num){
            if ($scope.data.newpassword.length <= 3){
                $scope.data.newpassword += num;
                $scope.reset();
            }
        };
        $scope.remove = function(){
            $scope.data.newpassword = $scope.data.newpassword.slice(0,-1);
            $scope.reset();
        };
        $scope.verify = function(){
            if ($scope.data.newpassword.length !== 4){
                $scope.setError('Please enter 4 digit passcode');
            }else{
                if ($scope.data.placeholder === 'Enter new password'){
                    $scope.data.placeholder = 'Confirm new password';
                    $scope.data.savepassword = $scope.data.newpassword;
                    $scope.data.newpassword = '';
                }else{
                    if ($scope.data.newpassword !== $scope.data.savepassword){
                        $scope.setError('Passcode doesn\'t matched');
                        $scope.data.placeholder = 'Enter new password';
                        $scope.data.savepassword = '';
                        $scope.data.newpassword = '';
                    }else{
                        var body = {
                            type: 'getEmployee',
                            passcode: $scope.data.savepassword
                        };
                        RetrieveEmployee.load(body, function(response){
                            if (response[0].passcode !== undefined){
                                $scope.setError('Passcode is already taken');
                                $scope.data.placeholder = 'Enter new password';
                                $scope.data.savepassword = '';
                                $scope.data.newpassword = '';
                            }else{
                                body = {
                                    type: 'updateEmployeePassword',
                                    newpasscode: $scope.data.savepassword,
                                    oldpasscode: oldPasscode
                                };
                                RetrieveEmployee.load(body, function(response){
                                    $scope.data.success = true;
                                });
                            }
                        });
                    }
                }
            }
        };
        $scope.finish = function(){
            $modalInstance.close();
        }
    }
);
