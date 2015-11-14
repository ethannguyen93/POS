'use strict';

// Workflows controller
angular.module('core').controller('buyGiftcardCtrl',
    function ($scope, $stateParams, $location, $modalInstance, RetrieveGiftcard) {
        $scope.numpad = ['1','2','3','4','5','6','7','8','9'];
        $scope.data = {
            isError: false,
            errorMessage: '',
            placeholder: 'Enter giftcard',
            gcnumber: '',
            view: 'start',
            type: 'use'
        };
        $scope.reset = function(){
            console.log('here');
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
                    $scope.data.type = 'reload';
                }else{
                    $scope.data.type = 'use';
                }
                $scope.data.view = 'addAmount'
            });
        };
        $scope.add = function(){
            if ($scope.data.newAmount === undefined){
                $scope.setError('Giftcard amount is invalid');
            }else{
                var newAmount = parseFloat($scope.data.newAmount);
                var id = guid();
                $modalInstance.close({_id: id, number: $scope.data.gcnumber, amount: newAmount, type: $scope.data.type});
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
