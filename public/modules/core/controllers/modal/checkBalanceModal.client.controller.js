'use strict';

// Workflows controller
angular.module('core').controller('checkBalanceCtrl',
    function ($scope, $stateParams, $location, $modalInstance, RetrieveGiftcard) {
        $scope.numpad = ['1','2','3','4','5','6','7','8','9'];
        $scope.data = {
            isError: false,
            errorMessage: '',
            placeholder: 'Enter giftcard',
            gcnumber: '',
            view: 'start',
            balance: 0
        };
        $scope.gc = {};
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.updatePasscode = function(num){
            $scope.data.gcnumber += num;
            $scope.reset();
        };
        $scope.setError = function(message){
            $scope.data.isError = true;
            $scope.data.errorMessage = message;
        };
        $scope.remove = function(){
            $scope.data.gcnumber = $scope.data.gcnumber.slice(0,-1);
            $scope.reset();
        };
        $scope.verify = function(){
            var body = {
                type: 'getGiftcard',
                number: $scope.data.gcnumber
            };
            RetrieveGiftcard.load(body, function(response){
                if (response[0].number !== undefined){
                    $scope.data.view = 'end';
                    $scope.data.balance = response[0].amount.toFixed(2);
                }else{
                    $scope.setError('Giftcard not existed');
                    $scope.data.gcnumber = '';
                }
            });
        };
        $scope.finish = function(){
            $modalInstance.close();
        }
    }
);
