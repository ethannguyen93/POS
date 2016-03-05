'use strict';

// Workflows controller
angular.module('pointcards').controller('addPointcardController', [
    '$scope', '$modalInstance', 'RetrievePointcard', 'pointcardNumber',
    function ($scope, $modalInstance, RetrievePointcard, pointcardNumber) {
        $scope.pointcardNumber = pointcardNumber;
        $scope.add = function(){
            var body = {
                type: 'addPointcard',
                number: pointcardNumber
            };
            RetrievePointcard.load(body, function(response){
                $modalInstance.close(response[0]);
            })
        };
        $scope.cancel = function(){
            $modalInstance.close('no');
        };
    }]
);
