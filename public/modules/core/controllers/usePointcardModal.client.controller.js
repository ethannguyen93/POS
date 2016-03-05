'use strict';

// Workflows controller
angular.module('core').controller('usePointcardCtrl',
    function ($scope, $stateParams, $location, $modalInstance, RetrievePointcard) {
        $scope.data = {
            isError: false,
            errorMessage: '',
            placeholder: 'Enter Point Card',
            number: ''
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
        $scope.reset = function(){
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.add = function(){
            var body = {
                type: 'getPointcard',
                number: $scope.data.number
            };
            RetrievePointcard.load(body, function(response){
                if (response[0].number !== undefined){
                    $modalInstance.close({number: response[0].number, _id: guid()});
                }else{
                    $scope.data.errorMessage = 'This Point Card does not exist.';
                    $scope.data.isError = true;
                }
            })
        };
        $scope.finish = function(){
            $modalInstance.close();
        }
    }
);
