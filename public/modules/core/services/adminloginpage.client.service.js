'use strict';

angular.module('core').factory('AdminLoginPageServices', [ '$q', 'RetrieveEmployee',
	function($q, RetrieveEmployee) {
		return {
			enterpassword: function($scope, key){
				switch (key){
					case 'shift':
						if ($scope.keyboard.shift === 'shift-on'){
							$scope.keyboard.shift = 'shift-off';
						}else{
							$scope.keyboard.shift = 'shift-on';
						}
						break;
					case 'delete':
						$scope.keyboard.password = $scope.keyboard.password.slice(0,-1);
						if ($scope.keyboard.shift !== 'tab-on'){
							$scope.keyboard.shift = 'shift-off';
						}
						break;
					case 'space':
						$scope.keyboard.password += ' ';
						if ($scope.keyboard.shift !== 'tab-on'){
							$scope.keyboard.shift = 'shift-off';
						}
						break;
					case 'tab':
						break;
					case 'caps':
						if ($scope.keyboard.shift === 'tab-on'){
							$scope.keyboard.shift = 'shift-off';
						}else{
							$scope.keyboard.shift = 'tab-on';
						}
						break;
					case 'enter':
						var body = {
							passcode: $scope.adminLogin.password,
							type: 'validateAdmin'
						};
						var getAdmin = function(){
							var deferred = $q.defer();
							RetrieveEmployee.load(body, function(response){
								var user = response[0];
								if (user.passcode !== undefined){
									$scope.view = 'adminpage';
									$scope.admin.setting.name = user.name;
									$scope.admin.setting.passcode = user.passcode;
									$scope.data.currentUser.name = user.name;
								}
								$scope.adminLogin.password = '';
								deferred.resolve();
							});
							return deferred.promise;
						};
						getAdmin();
						break;
					default:
						$scope.adminLogin.password += key;
						if ($scope.keyboard.shift !== 'tab-on'){
							$scope.keyboard.shift = 'shift-off';
						}
						break;
				}
			}
		};
	}
]);
