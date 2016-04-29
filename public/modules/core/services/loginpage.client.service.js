'use strict';

angular.module('core').factory('LoginpageService', ['$state', 'UserService', 'RetrieveEmployee', '$q',
    function ($state, UserService, RetrieveEmployee, $q) {
        var _passcode = {
            value: ""
        };

        return {
            init: function () {
                // reset password value
                this.resetPasscode();
                return _passcode;
            },
            resetPasscode: function () {
                _passcode.value = "";
            },
            getPasscode: function () {
                return _passcode;
            },
            updatePasscode: function (num) {
                if (_passcode.value.length <= 3) {
                    _passcode.value += num;
                }
            },
            remove: function () {
                _passcode.value = _passcode.value.slice(0, -1);
            },
            verify: function () {
                var self = this,
                    deferred = $q.defer(),
                    body = {
                        type: 'getEmployee',
                        passcode: _passcode.value
                    };

                if (_passcode.value.length <= 0) {
                    deferred.reject('No Passcode supplied!');
                }

                RetrieveEmployee.load(body, function (response) {
                    var user = response[0];

                    if (user && user.passcode !== undefined) {
                        UserService.setUser(user);
                        body = {type: 'getAll'};
                        /*RetrieveEmployee.load(body, function(response){
                         var employees = [];
                         _.each(response, function(res){
                         employees.push(res.name);
                         });
                         $scope.data.employees = employees;
                         $scope.data.selectedEmployee = employees[0];
                         $scope.view = 'mainpage';
                         // Go from 'core.login' to 'core.authenticated' state
                         $state.go('^.authenticated');
                         });*/
                        deferred.resolve('Successfully Logged in!');
                    } else {
                        deferred.reject('No User found!');
                    }
                    self.resetPasscode();
                });
                return deferred.promise;
            }
        };
    }
]);
