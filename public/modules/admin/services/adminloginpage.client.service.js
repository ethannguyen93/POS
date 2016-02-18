'use strict';

angular.module('admin').factory('AdminLoginPageServices', [ '$state', '$q', 'RetrieveEmployee',
	function($state, $q, RetrieveEmployee) {
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
						console.log($scope.adminLogin.password);
						$scope.adminLogin.password = $scope.adminLogin.password.slice(0, -1);
						console.log($scope.adminLogin.password);
						if ($scope.keyboard.shift !== 'tab-on'){
							$scope.keyboard.shift = 'shift-off';
						}
						break;
					case 'space':
						$scope.adminLogin.password += ' ';
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
									// 1st Parent is the Empty Controller created by Abstract State
									$scope.$parent.$parent.view = 'adminpage';
									$state.go('^.authenticated.settings', {
										user: {
											name: user.name,
											passcode: user.passcode
										}
									});
									/*$scope.admin.setting.name = user.name;
									$scope.admin.setting.passcode = user.passcode;
									$scope.data.currentUser.name = user.name;*/
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
