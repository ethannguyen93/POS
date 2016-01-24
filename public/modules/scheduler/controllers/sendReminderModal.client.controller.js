'use strict';

// Workflows controller
angular.module('scheduler').controller('sendReminderController', [
    '$scope', '$modalInstance', 'RetrieveAppointments',
    function ($scope, $modalInstance, RetrieveAppointments) {
        $scope.initModal = (function(){
            var body = {
                type: 'getNumberOfReminders'
            };
            RetrieveAppointments.load(body, function(response){
                $scope.email = response[0].email;
                $scope.phone = response[0].phone;
            })
        })();
        $scope.send = function(){
            $modalInstance.close('yes');
        };
        $scope.cancel = function(){
            $modalInstance.close('no');
        };
    }]
);
