'use strict';

angular.module('core').factory('AdminPageServices', [ 'RetrieveEmployee', 'RetrieveInventory', '$q', 'RetrieveGiftcard',
	function(RetrieveEmployee, RetrieveInventory, $q, RetrieveGiftcard) {
		return {
			getDB: function(item){
				switch (item){
					case 'employee':
						var DB = RetrieveEmployee;
						break;
					case 'item':
					case 'category':
						var DB = RetrieveInventory;
						break;
					case 'giftcard':
						var DB = RetrieveGiftcard;
						break
				}
				return DB;
			},
			getAll: function($scope, item) {
				var deferred = $q.defer();
				var self = this;
				$scope.admin.page = item;
				var body = {
					type: 'getAll',
					part: item
				};
				var DB = self.getDB(item);
				DB.load(body, function(response){
					switch (item){
						case 'employee':
							$scope.admin.employee.employees = [];
							_.map(response, function(e){
								var employee = {name: e.name, passcode: e.passcode};
								$scope.admin.employee.employees.push(employee);
							});
							deferred.resolve();
							break;
						case 'category':
							$scope.admin.category.categories = [];
							_.map(response, function(c){
								var category = {name: c.name};
								$scope.admin.category.categories.push(category);
							});
							deferred.resolve();
							break;
						case 'item':
							$scope.admin.item.items = [];
							_.map(response, function(i){
								var item = {name: i.name, category: i.category, price: i.price};
								$scope.admin.item.items.push(item);
							});
							self.getAllCategories($scope).then(function() {
								deferred.resolve();
							});
							break;
						case 'giftcard':
							$scope.admin.giftcard.giftcards = [];
							_.map(response, function(i){
								var gc = {number: i.number, amount: i.amount};
								$scope.admin.giftcard.giftcards.push(gc);
							});
							deferred.resolve();
							break;
					}
				});
				return deferred.promise;
			},
			getAllCategories: function($scope){
				var deferred = $q.defer();
				var body = {
					type: 'getAll',
					part: 'category'
				};
				RetrieveInventory.load(body, function(response){
					$scope.admin.category.categories = [];
					_.map(response, function(c){
						var category = {name: c.name};
						$scope.admin.category.categories.push(category);
					});
					deferred.resolve();
				});
				return deferred.promise;
			},
			remove: function($scope, data, item){
				var self = this;
				var body = {
					type: 'remove',
					data: data,
					part: item
				};
				var DB = self.getDB(item);
				DB.load(body, function(){
					console.log('removed');
					self.getAll($scope, item);
				});
			},
			add: function($scope, data, item){
				var deferred = $q.defer();
				var self = this;
				var body = {
					type: 'add',
					data: data,
					part: item
				};
				var DB = self.getDB(item);
				DB.load(body, function(){
					self.getAll($scope, item).then(function(){
						deferred.resolve();
					});
				});
				return deferred.promise;
			},
			rename: function($scope, data, item){
				var deferred = $q.defer();
				var self = this;
				var body = {
					type: 'rename',
					data: data
				};
				var DB = self.getDB(item);
				DB.load(body, function(){
					self.getAll($scope, item).then(function(){
						deferred.resolve();
					});
				})
			},
			updateItem: function($scope, data, item){
				var deferred = $q.defer();
				var self = this;
				var body = {
					type: 'updateItem',
					data: data
				};
				var DB = self.getDB(item);
				DB.load(body, function(){
					self.getAll($scope, item).then(function(){
						deferred.resolve();
					});
				})
			},
			changepassword: function($scope, passcode, newpasscode, newpasscode_repeat){
				if (newpasscode === undefined || newpasscode_repeat === undefined
					|| newpasscode === '' || newpasscode_repeat === ''){
					$scope.admin.setting.isError = true;
					$scope.admin.setting.errorMessage = 'Please enter all the information';
				}else if (newpasscode === newpasscode_repeat){
					var body = {
						type: 'updateAdminPassword',
						passcode: passcode,
						newpasscode: newpasscode
					};
					RetrieveEmployee.load(body, function(response){
						console.log(response);
						$scope.admin.passcode = newpasscode;
						$scope.admin.setting.newpasscode = '';
						$scope.admin.setting.newpasscode_repeat = '';
						$scope.admin.setting.passcode = newpasscode;
						$scope.admin.setting.isError = true;
						$scope.admin.setting.errorMessage = 'Password has been updated successfully';
					});
				}else{
					$scope.admin.setting.isError = true;
					$scope.admin.setting.errorMessage = 'Password doesn\'t match';
				}
			}
		};
	}
]);
