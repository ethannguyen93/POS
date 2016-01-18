'use strict';

angular.module('core').factory('LoginpageService', ['$state', 'RetrieveEmployee', '$q',
	function($state, RetrieveEmployee, $q) {
		return {
			updatePasscode: function($scope, num){
				if ($scope.data.password.length <= 3){
					$scope.data.password += num;
				}
			},
			remove: function($scope){
				$scope.data.password = $scope.data.password.slice(0,-1);
			},
			verify: function($scope){
				var body = {
					type: 'getEmployee',
					passcode: $scope.data.password
				};
				RetrieveEmployee.load(body, function(response){
					var user = response[0];
					if (user.passcode !== undefined && user.isAdmin){
						$scope.data.currentUser.name = user.name;
						body = {
							type: 'getAll'
						};
						RetrieveEmployee.load(body, function(response){
							var employees = [];
							_.each(response, function(res){
								employees.push(res.name);
							});
							$scope.data.employees = employees;
							$scope.data.selectedEmployee = employees[0];
							$scope.view = 'mainpage';
							// Go from 'core.login' to 'core.authenticated' state
							$state.go('^.authenticated');

						});
					}else if (user.passcode !== undefined){
						$scope.data.currentUser.name = user.name;
						$scope.view = 'mainpage';
						// Go from 'core.login' to 'core.authenticated' state
						$state.go('^.authenticated');
					}
					$scope.data.password = '';
				});
			}
		};
	}
]);
