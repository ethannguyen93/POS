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
									$scope.admin = {
										page: 'setting',
										setting: {
											name: '',
											passcode: '',
											newpasscode: '',
											newpasscode_repeat: '',
											isError: false,
											errorMessage: ''
										},
										employee: {
											isError: false,
											errorMessage: '',
											gridOptions: {
												rowHeight: 60,
												columnFooterHeight: 60,
												showColumnFooter: true,
												enableFiltering: true,
												enablePaginationControls: false,
												paginationPageSize: 10,
												data: 'admin.employee.employees'
											},
											employees: [],
											newemployeename: '',
											newemployeepasscode: ''
										},
										category: {
											isError: false,
											errorMessage: '',
											gridOptions: {
												rowHeight: 60,
												columnFooterHeight: 60,
												showColumnFooter: true,
												enableFiltering: true,
												enablePaginationControls: false,
												paginationPageSize: 10,
												data: 'admin.category.categories'
											},
											categories: [],
											newcategoryname: ''
										},
										giftcard: {
											isError: false,
											errorMessage: '',
											gridOptions: {
												rowHeight: 60,
												columnFooterHeight: 60,
												enableFiltering: true,
												enablePaginationControls: false,
												paginationPageSize: 10,
												data: 'admin.giftcard.giftcards'
											},
											giftcards: [],
											newgc: '',
											newgcprice: ''
										},
										report: {
											isError: false,
											errorMessage: '',
											gridOptions: {
												columnDefs: [
													{ field: 'name' },
													{ field: 'gender', visible: false},
													{ field: 'company' }
												],
												rowHeight: 60,
												enablePaginationControls: false,
												paginationPageSize: 10,
												data: 'admin.report.reports'
											},
											reports: [],
											selectedOption: ''
										},
										item: {
											isError: false,
											errorMessage: '',
											gridOptions: {
												rowHeight: 60,
												columnFooterHeight: 60,
												showColumnFooter: true,
												enableFiltering: true,
												enablePaginationControls: false,
												paginationPageSize: 10,
												data: 'admin.item.items'
											},
											items: [],
											newitemname: '',
											newitemprice: '',
											newcat: ''
										}
									};
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
