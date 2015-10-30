'use strict';

angular.module('core').factory('LoginpageService', ['RetrieveEmployee', '$q',
	function(RetrieveEmployee, $q) {
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
					if (user.passcode !== undefined){
						$scope.data.currentUser.name = user.name;
						$scope.view = 'mainpage';
					}
					$scope.data.password = '';
				});
			}
		};
	}
]);
