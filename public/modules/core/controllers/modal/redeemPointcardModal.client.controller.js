'use strict';

// Workflows controller
angular.module('core').controller('redeemPointcardCtrl',
    function ($scope, $stateParams, $location, $modalInstance, RetrievePointcard) {
        $scope.data = {
            isError: false,
            errorMessage: '',
            number: '',
            point: '',
            pointredeem: 0
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
        };
        $scope.view = 'input';
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.redeem = function(){
            if ($scope.data.pointredeem > $scope.data.point){
                $scope.data.errorMessage = 'The amount exceed number of point available';
                $scope.data.isError = true;
            }else{
                var body = {
                    type: 'getSetting'
                };
                RetrievePointcard.load(body, function(response){
                    $modalInstance.close({
                        price: $scope.data.pointredeem / response[0].redeem,
                        pointredeem: $scope.data.pointredeem,
                        number: $scope.data.number,
                        _id: guid()
                    });
                })
            }
        };
        $scope.next = function(){
            var body = {
                type: 'getPointcard',
                number: $scope.data.number
            };
            RetrievePointcard.load(body, function(response){
                if (response[0].number !== undefined){
                    $scope.data.point = response[0].point;
                    $scope.view = 'redeem';
                }else{
                    $scope.data.errorMessage = 'This Point Card does not exist.';
                    $scope.data.isError = true;
                }
            })
        };
        $scope.back = function(){
            $scope.view = 'input';
            $scope.data = {
                isError: false,
                errorMessage: '',
                number: '',
                point: '',
                pointredeem: ''
            };
        };
        $scope.finish = function(){
            $modalInstance.close();
        }
    }
);
