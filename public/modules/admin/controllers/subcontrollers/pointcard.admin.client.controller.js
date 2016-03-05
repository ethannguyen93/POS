'use strict';

angular.module('admin').controller('PointCard.AdminController', ['$scope', '$state', '$stateParams', 'RetrievePointcard', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices',
    function ($scope, $state, $stateParams, RetrievePointcard, MainpageServices,
              LoginpageService, $q, AdminLoginPageServices, AdminPageServices) {
        $scope.data = {
            errorMessage: '',
            isError: false,
            credit: '',
            debit: '',
            cash: '',
            redeem: '',
            isSuccess: false
        };
        $scope.reset = function(){
            $scope.data.errorMessage = '';
            $scope.data.isError = false;
            $scope.data.isSuccess = false;
        };
        $scope.initPointCard = function(){
            var body = {
                type: 'getSetting'
            };
            RetrievePointcard.load(body, function(response){
                if (response[0].type === 'PointCard'){
                    $scope.data.credit = response[0].credit;
                    $scope.data.debit = response[0].debit;
                    $scope.data.cash = response[0].cash;
                    $scope.data.redeem = response[0].redeem;
                }
            })
        };
        $scope.changeSetting = function(data){
            if (isNaN(data.debit) || isNaN(data.credit) || isNaN(data.redeem) || isNaN(data.cash)){
                $scope.data.isError = true;
                $scope.data.errorMessage = 'Please enter correct format (number only)';
            }else{
                var body = {
                    type: 'setSetting',
                    credit: data.credit,
                    debit: data.debit,
                    cash: data.cash,
                    redeem: data.redeem
                };
                RetrievePointcard.load(body, function(response){
                    $scope.data.isSuccess = true;
                    $scope.data.errorMessage = 'Update Successfully.';
                })
            }
        }
    }]);
