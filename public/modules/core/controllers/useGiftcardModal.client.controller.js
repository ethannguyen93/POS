'use strict';

// Workflows controller
angular.module('core').controller('useGiftcardCtrl',
    function ($scope, $stateParams, $location, $modalInstance, RetrieveGiftcard) {
        $scope.numpad = ['1','2','3','4','5','6','7','8','9'];
        $scope.data = {
            isError: false,
            errorMessage: '',
            placeholder: 'Enter giftcard',
            gcnumber: '',
            balance: 0,
            view: 'start'
        };
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
                    //$modalInstance.close(response[0]);
                    $scope.data.view = 'addAmount';
                    $scope.data.balance = response[0].amount;
                }else{
                    $scope.setError('Giftcard not existed');
                    $scope.data.gcnumber = '';
                }
            });
        };
        $scope.add = function(){
            if ($scope.data.newAmount === undefined){
                $scope.setError('Giftcard amount is invalid');
            }else{
                var newAmount = parseFloat($scope.data.newAmount);
                if (newAmount > $scope.data.balance){
                    $scope.setError('Amount exceeds remaining balance');
                }else{
                    var id = guid();
                    $modalInstance.close({_id: id, number: $scope.data.gcnumber, amount: newAmount});
                }
            }
        };
        var guid = function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
        $scope.finish = function(){
            $modalInstance.close();
        }
    }
);
