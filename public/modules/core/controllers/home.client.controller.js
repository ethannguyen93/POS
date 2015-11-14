'use strict';


angular.module('core').controller('HomeController', [
	'$scope', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
	'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$modal',
	function(
		$scope, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
		LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $modal
	) {
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		$scope.view = 'mainpage';
		$scope.logOut = function(){
			$scope.view = 'numpad';
			$scope.data.subtotal = 0;
			$scope.data.tax = 0;
			$scope.data.password = '';
			$scope.data.order = '';
			$scope.data.index = 0;
			$scope.data.orders = [];
			$scope.data.categories = [];
			$scope.data.items = [];
			$scope.data.currentUser = {
				name: ''
			};
		};
		$scope.navigateAdminPage = function(){
			$scope.view = 'adminpagelogin';
		};
		$scope.navigateNumpadPage = function(){
			$scope.view = 'numpad';
		};
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/*Admin Login Page*/
		$scope.adminLogin = {
			password: ''
		};
		$scope.keyboard = {
			shift: 'shift-off',
			keyboard:{
				shiftoff:{
					firstline: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
					secondline: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
					thirdline: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
					forthline: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.','/']
				},
				shifton:{
					firstline: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
					secondline: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}'],
					thirdline: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"'],
					forthline: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>','?']
				},
				tabon:{
					firstline: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
					secondline: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
					thirdline: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\''],
					forthline: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.','/']
				}
			}
		};
		$scope.enter = function(key){
			AdminLoginPageServices.enterpassword($scope, key);
		};
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/*User Login Page*/
		$scope.numpad = ['1','2','3','4','5','6','7','8','9'];
		$scope.updatePasscode = function(num){
			LoginpageService.updatePasscode($scope, num);
		};
		$scope.remove = function(){
			LoginpageService.remove($scope);
		};
		$scope.verify = function(){
			LoginpageService.verify($scope)
		};
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/*User Main Page*/
		$scope.data = {
			password : '',
			order: 0,
			index: 0,
			orders: [],
			categories: [],
			items: [],
			subtotal: 0,
			tax: 0,
			customerName: '',
			currentUser: {
				name: ''
			},
			gridOptions: {
				rowHeight: 60,
				columnHeaderHeight: 60,
				columnFooterHeight: 60,
				enablePaginationControls: false,
				paginationPageSize: 10,
				data: 'data.orders'
			}
		};
		$scope.data.gridOptions.onRegisterApi = function (gridApi) {
			$scope.data.gridApi = gridApi;
		};
		$scope.data.initOrder = function(){
			$scope.data.gridOptions.columnDefs = [
				{
					name: '#' ,
					field: 'index',
					width: '80'
				},
				{
					name: 'Item' ,
					field: 'name'
				},
				{
					name: 'Price' ,
					field: 'price',
					cellFilter: 'priceFilter'
					//width: '200'
				},
				{
					name: 'Quantity',
					cellTemplate: 'modules/core/views/partials/mainpage/plusminus.client.view.html'
					//width: '200'
				},
				{
					name: 'Remove',
					cellTemplate: 'modules/core/views/partials/mainpage/remove.client.view.html',
					width: '150'
				}
			];
		};
		$scope.initMainpage = function(){
			var body = {
				'type': 'retrieveCat'
			};
			RetrieveInventory.load(body, function(response){
				$scope.data.category = _.map(response, _.clone);
				$scope.data.orderModal().then(function(selectedItem){
					console.log(selectedItem.message);
					switch (selectedItem.message){
						case undefined:
						case 'no':
							$scope.view = 'numpad';
							break;
						case 'neworder':
							$scope.data.index = selectedItem.data;
							$scope.data.customerName = selectedItem.customerName;
							$scope.data.subtotal = 0;
							$scope.data.tax = 0;
							break;
						case 'order':
							$scope.data.index = selectedItem.data.index;
							$scope.data.order = selectedItem.data._id;
							$scope.data.orders = selectedItem.data.orders;
							$scope.data.customerName = selectedItem.data.customerName;
							$scope.data.subtotal = selectedItem.data.subtotal;
							$scope.data.tax = selectedItem.data.tax;
							break;
					}
				});
			});
		};
		$scope.data.orderModal = function(){
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/core/views/orderModal.client.view.html',
				controller: 'orderCtrl',
				backdrop : 'static',
				resolve: {
					currentUser : function(){
						return $scope.data.currentUser;
					}
				}
			});
			editorInstance.result.then(function (selectedItem) {
				deferred.resolve(selectedItem);
			});
			return deferred.promise;
		};
		$scope.getItem = function(cat){
			MainpageServices.getItem($scope, cat);
		};
		$scope.addItemToOrder = function(item){
			MainpageServices.addItem($scope, item);
			$scope.data.tax += item.price * 0.13;
		};
		$scope.updateOrder = function(type, index){
			MainpageServices.updateOrder($scope, type, index);
			if ($scope.data.subtotal < 0){
				$scope.data.subtotal = 0;
			}
		};
		$scope.removeItemFromOrder = function(id){
			var item = _.find($scope.data.orders, function(order){
				return order.id === id;
			});
			MainpageServices.removeItem($scope, item);
			if (!item.isGiftcard){
				$scope.data.tax -= item.price * 0.13 * item.quantity;
				if ($scope.data.subtotal <= 0 && $scope.data.subtotal > -0.1){
					$scope.data.subtotal = 0;
				}
			}
		};
		$scope.data.checkBalance = function () {
			$scope.data.checkBalanceModal();
		};
		$scope.data.checkBalanceModal = function () {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/core/views/checkBalanceModal.client.view.html',
				controller: 'checkBalanceCtrl'
			});
			editorInstance.result.then(function () {
				deferred.resolve();
			});
			return deferred.promise;
		};
		$scope.data.buyGiftcard = function () {
			$scope.data.buyGiftcardModal().then(function(giftcard){
				if (giftcard !== undefined){
					giftcard.name = 'Giftcard ' + giftcard.number + ' - ' + giftcard.type;
					giftcard.price = giftcard.amount;
					MainpageServices.addItem($scope, giftcard);
				}
			});
		};
		$scope.data.buyGiftcardModal = function () {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/core/views/buyGiftcardModal.client.view.html',
				controller: 'buyGiftcardCtrl'
			});
			editorInstance.result.then(function (giftcard) {
				deferred.resolve(giftcard);
			});
			return deferred.promise;
		};
		$scope.data.useGiftcard = function () {
			$scope.data.useGiftcardModal().then(function(giftcard){
				if (giftcard !== undefined){
					giftcard.name = 'Giftcard ' + giftcard.number;
					giftcard.price = - giftcard.amount;
					MainpageServices.addItem($scope, giftcard);
				}
			});
		};
		$scope.data.useGiftcardModal = function () {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/core/views/useGiftcardModal.client.view.html',
				controller: 'useGiftcardCtrl'
			});
			editorInstance.result.then(function (giftcard) {
				deferred.resolve(giftcard);
			});
			return deferred.promise;
		};
		$scope.data.saveOrder = function () {
			MainpageServices.saveOrder($scope);
			$scope.logOut();
		};
		$scope.data.doneOrder = function () {
			$scope.data.doneOrderModal().then(function(selectedItem){
				if (selectedItem === 'yes'){
					var body = {
						'type': 'doneOrder',
						'order': $scope.data.order,
						'orders': $scope.data.orders,
						'user': $scope.data.currentUser,
						'customerName': $scope.data.customerName,
						'subtotal': $scope.data.subtotal,
						'tax': $scope.data.tax
					};
					RetrieveInventory.load(body, function(){
						$scope.logOut();
					});
				}
			})
		};
		$scope.data.doneOrderModal = function () {
			var deferred = $q.defer();
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'modules/core/views/doneOrderModal.client.view.html',
				controller: 'ModalInstanceCtrl'
			});

			modalInstance.result.then(function (selectedItem) {
				deferred.resolve(selectedItem);
			});

			return deferred.promise;
		};
		$scope.data.printReceipt = function () {
			console.log('here');
			var body = {
				'type': 'printReceipt'
			};
			RetrieveInventory.load(body, function(response){
				console.log(response);
			});
		};
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/**********************************************************************************************************/
		/*Admin Main Page*/
		$scope.admin = {
			page: 'report',
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
		$scope.showDashboard = function(){
			$scope.admin.page = 'setting';
			$scope.admin.setting.isError = false;
			$scope.admin.setting.errorMessage = '';
			$scope.admin.setting.newpasscode = '';
			$scope.admin.setting.newpasscode_repeat = '';
		};
		$scope.changepassword = function(){
			AdminPageServices.changepassword($scope, $scope.admin.newpasscode, $scope.admin.newpasscode_repeat)
		};
		$scope.admin.setting.onchange = function(){
			$scope.admin.setting.isError = false;
			$scope.admin.setting.errorMessage = '';
		};
		/**
		 *
		 * @param item: decide which object to load
		 */
		$scope.getAll = function(item){
			var deferred = $q.defer();
			AdminPageServices.getAll($scope, item).then(function(){
				deferred.resolve();
			});
			return deferred.promise;
		};
		/******************************************************************************************************/
		$scope.showEmployee = function(){
			$scope.admin.employee.newemployeename = '';
			$scope.admin.employee.newemployeepasscode = '';
			$scope.admin.employee.errorMessage = '';
			$scope.admin.employee.isError = false;
			AdminPageServices.getAll($scope, 'employee');
		};
		$scope.admin.employee.gridOptions.onRegisterApi = function (gridApi) {
			$scope.admin.employee.gridApi = gridApi;
			gridApi.edit.on.beginCellEdit($scope, function(){
				$scope.admin.employee.isError = false;
				$scope.admin.employee.errorMessage = '';
			});
			gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
				var regex = new RegExp("^[A-Za-z0-9]+$");
				if (!regex.test(newValue)){
					$scope.admin.employee.isError = true;
					$scope.admin.employee.errorMessage = 'This employee name is invalid';
					rowEntity.name = oldValue;
				}else{
					var tmp = _.filter($scope.admin.employee.employees, function(e){ return e.name === newValue});
					if (tmp.length > 1){
						$scope.admin.employee.isError = true;
						$scope.admin.employee.errorMessage = 'This employee is already existed';
						rowEntity.name = oldValue;
					}else{
						var data = {
							newName: newValue,
							oldName: oldValue,
							passcode: _.find($scope.admin.employee.employees, function(e){ return e.name === newValue}).passcode
						};
						AdminPageServices.rename($scope, data, 'employee');
					}
				}
			});
		};
		$scope.admin.employee.changePasscode = function (passcode) {
			$scope.admin.employee.changeEmployeePasscodeModal(passcode).then(function(){
				$scope.getAll('employee');
			});
		};
		$scope.admin.employee.changeEmployeePasscodeModal = function (passcode) {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/core/views/changePasscodeModal.client.view.html',
				controller: 'changePasscodeCtrl',
				resolve: {
					oldPasscode : function(){
						return passcode;
					}
				}
			});
			editorInstance.result.then(function () {
				deferred.resolve();
			});
			return deferred.promise;
		};
		$scope.initEmployee = function(){
			$scope.getAll('employee').then(function(){
				$scope.admin.employee.gridOptions.columnDefs = [
					{
						name: 'Employee name' ,
						field: 'name',
						footerCellTemplate: '<input ng-model="grid.appScope.admin.employee.newemployeename" ' +
						'ng-change="grid.appScope.admin.employee.onchange()" placeholder="Enter new employee name" ng-pattern="/^[A-Za-z0-9]+$/"/>',
						enableCellEdit: true
					},
					{
						name: 'Passcode' ,
						field: 'passcode',
						enableFiltering: false,
						footerCellTemplate: '<input ng-model="grid.appScope.admin.employee.newemployeepasscode" ' +
						'ng-change="grid.appScope.admin.employee.onchange()" placeholder="Enter new employee passcode" ng-pattern="/^[0-9]{4}$/"/>',
						enableCellEdit: false
					},
					{
						name: 'Change Password' ,
						field: 'passcode',
						cellTemplate: '<button type="button" class="btn btn-info btn-block" ng-click="grid.appScope.admin.employee.changePasscode(row.entity.passcode)">Change password</button>',
						enableFiltering: false,
						enableCellEdit: false
					},
					{
						name: 'Add/Remove',
						enableFiltering: false,
						cellTemplate: '<a href="" ng-click="grid.appScope.removeEmployee(row.entity.passcode, row.entity.name)"' +
						'><span class="glyphicon glyphicon-remove"></span></a>',
						enableCellEdit: false,
						footerCellTemplate: '<a href="" ng-click="grid.appScope.addEmployee()"> <span class="glyphicon glyphicon-plus"></span> </a>'
					}
				];
			});
		};
		$scope.removeEmployee = function(passcode, name){
			var data = {
				passcode: passcode,
				name: name
			};
			AdminPageServices.remove($scope, data, 'employee');
		};
		$scope.admin.employee.onchange = function(){
			$scope.admin.employee.isError = false;
			$scope.admin.employee.errorMessage = '';
		};
		$scope.addEmployee = function(){
			if ($scope.admin.employee.newemployeename === undefined ||
					$scope.admin.employee.newemployeepasscode === undefined ||
					$scope.admin.employee.newemployeename === '' ||
					$scope.admin.employee.newemployeepasscode === '') {
				$scope.admin.employee.isError = true;
				$scope.admin.employee.errorMessage = 'Please fill both name and passcode';
			}else if (_.find($scope.admin.employee.employees, function(e){
					return $scope.admin.employee.newemployeename === e.name
				}) !== undefined){
				$scope.admin.employee.isError = true;
				$scope.admin.employee.errorMessage = 'This name is already taken';
			}else if (_.find($scope.admin.employee.employees, function(e){
					return $scope.admin.employee.newemployeepasscode === e.passcode
				}) !== undefined) {
				$scope.admin.employee.isError = true;
				$scope.admin.employee.errorMessage = 'This passcode is already taken';
			}else{
				var data = {
					passcode: $scope.admin.employee.newemployeepasscode,
					name: $scope.admin.employee.newemployeename
				};
				AdminPageServices.add($scope, data, 'employee');
				$scope.admin.employee.newemployeename = '';
				$scope.admin.employee.newemployeepasscode = '';
			}
		};
		/******************************************************************************************************/
		$scope.showCategory = function(){
			$scope.admin.category.newcategoryname = '';
			$scope.admin.category.errorMessage = '';
			$scope.admin.category.isError = false;
			AdminPageServices.getAll($scope, 'category');
		};
		$scope.removeCategory = function(name){
			var data = {
				name: name
			};
			AdminPageServices.remove($scope, data, 'category');
		};
		$scope.addCategory = function(){
			if ($scope.admin.category.newcategoryname === undefined || $scope.admin.category.newcategoryname === ''){
				$scope.admin.category.isError = true;
				$scope.admin.category.errorMessage = 'Please enter category name';
			} else if (_.find($scope.admin.category.categories, function(cat){
					return $scope.admin.category.newcategoryname === cat.name
				}) === undefined){
				var data = {
					name: $scope.admin.category.newcategoryname
				};
				AdminPageServices.add($scope, data, 'category').then(function(){
					$scope.admin.category.newcategoryname = '';
				});
			}else{
				$scope.admin.category.isError = true;
				$scope.admin.category.errorMessage = 'This category is already existed';
			}
		};
		$scope.admin.category.gridOptions.onRegisterApi = function (gridApi) {
			$scope.admin.category.gridApi = gridApi;
			gridApi.edit.on.beginCellEdit($scope, function(){
				$scope.admin.category.isError = false;
				$scope.admin.category.errorMessage = '';
			});
			gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
				var regex = new RegExp("^[A-Za-z0-9]+$");
				if (!regex.test(newValue)){
					$scope.admin.category.isError = true;
					$scope.admin.category.errorMessage = 'This category name is invalid';
					rowEntity.name = oldValue;
				}else{
					var tmp = _.filter($scope.admin.category.categories, function(cat){ return cat.name === newValue});
					if (tmp.length > 1){
						$scope.admin.category.isError = true;
						$scope.admin.category.errorMessage = 'This category is already existed';
						rowEntity.name = oldValue;
					}else{
						var data = {
							newName: newValue,
							oldName: oldValue
						};
						AdminPageServices.rename($scope, data, 'category');
					}
				}
			});
		};
		$scope.admin.category.onchange = function(){
			$scope.admin.category.isError = false;
			$scope.admin.category.errorMessage = '';
		};
		$scope.initCategory = function(){
			$scope.getAll('category').then(function(){
				$scope.admin.category.gridOptions.columnDefs = [
						{
							name: 'Category name' ,
							field: 'name',
							footerCellTemplate: '<input ng-model="grid.appScope.admin.category.newcategoryname" ' +
										'ng-change="grid.appScope.admin.category.onchange()" placeholder="Enter new category name"ng-pattern="/^[A-Za-z0-9]+$/"/>',
							enableCellEdit: true
						},
						{
							name: 'Add/Remove',
							enableFiltering: false,
							cellTemplate: '<a href="" ng-click="grid.appScope.removeCategory(row.entity.name)"' +
										'><span class="glyphicon glyphicon-remove"></span></a>',
							enableCellEdit: false,
							footerCellTemplate: '<a href="" ng-click="grid.appScope.addCategory()"> <span class="glyphicon glyphicon-plus"></span> </a>'
						}
					];
			});
		};
		/******************************************************************************************************/
		$scope.showItem = function(){
			$scope.admin.item.newcat = '';
			$scope.admin.item.errorMessage = '';
			$scope.admin.item.isError = false;
			$scope.admin.item.newitemname = '';
			$scope.admin.item.newitemprice = '';
			AdminPageServices.getAll($scope, 'item');
		};
		$scope.removeItem = function(name, category, price){
			var data = {
				name: name,
				category: category,
				price: price
			};
			AdminPageServices.remove($scope, data, 'item');
		};
		$scope.addItem = function(){
			if ($scope.admin.item.newitemname === undefined ||
				$scope.admin.item.newitemname === '' ||
				$scope.admin.item.newcat === undefined ||
				$scope.admin.item.newcat === '' ||
				$scope.admin.item.newitemprice === undefined ||
				$scope.admin.item.newitemprice === ''
			){
				$scope.admin.item.isError = true;
				$scope.admin.item.errorMessage = 'Please fill all box below';
			} else if (_.find($scope.admin.item.items, function(item){
					return $scope.admin.item.newitemname === item.name
					&& $scope.admin.item.newcat === item.cat
					&& $scope.admin.item.newitemprice === item.price
				}) === undefined){
				var data = {
					name: $scope.admin.item.newitemname,
					category: $scope.admin.item.newcat.name,
					price: parseFloat($scope.admin.item.newitemprice)
				};
				AdminPageServices.add($scope, data, 'item').then(function(){
					$scope.admin.item.newcat = '';
					$scope.admin.item.newitemname = '';
					$scope.admin.item.newitemprice = '';
				});
			}else{
				$scope.admin.category.isError = true;
				$scope.admin.category.errorMessage = 'This item is already existed';
			}
		};
		$scope.admin.item.onchange = function() {
			$scope.admin.item.isError = false;
			$scope.admin.item.errorMessage = '';
		};
		$scope.admin.item.gridOptions.onRegisterApi = function (gridApi) {
			$scope.admin.item.gridApi = gridApi;
			gridApi.edit.on.beginCellEdit($scope, function(){
				$scope.admin.category.isError = false;
				$scope.admin.category.errorMessage = '';
			});
			gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
				var field = colDef.field;
				var tmp = _.filter($scope.admin.item.items, function(item){
					return (item.name === rowEntity.name
							&& item.category === rowEntity.category
							&& item.price === rowEntity.price)
				});
				if (tmp.length > 1){
					$scope.admin.item.isError = true;
					$scope.admin.item.errorMessage = 'This item is already existed';
					rowEntity[field] = oldValue;
				}else{
					var data = {
						newValue: newValue,
						oldValue: oldValue,
						field: field,
						item: rowEntity
					};
					AdminPageServices.updateItem($scope, data, 'item');
				}
			});
		};
		$scope.initItem = function(){
			$scope.getAll('item').then(function(){
				$scope.admin.item.gridOptions.columnDefs = [
					{
						name: 'Item name' ,
						field: 'name',
						footerCellTemplate: '<input ng-model="grid.appScope.admin.item.newitemname" ' +
						'ng-change="grid.appScope.admin.item.onchange()" placeholder="Enter new item name"ng-pattern="/^.+$/"/>',
						enableCellEdit: true
					},
					{
						name: 'Category name',
						field: 'category',
						footerCellTemplate: '<select class="form-control" ng-model="grid.appScope.admin.item.newcat" ng-change="grid.appScope.admin.item.onchange()" ng-options="category as category.name for category in grid.appScope.admin.category.categories"></select>',
						enableCellEdit: false
						/*cellFilter: 'categoryFilter:grid.appScope.admin.category.categories',*/
						/*editDropdownValueLabel: 'name',
						editableCellTemplate: 'ui-grid/dropdownEditor',
						editDropdownOptionsArray: $scope.admin.category.categories*/
					},
					{
						name: 'Price' ,
						field: 'price',
						cellFilter: 'priceFilter',
						footerCellTemplate: '<input ng-model="grid.appScope.admin.item.newitemprice" ' +
						'ng-change="grid.appScope.admin.item.onchange()" placeholder="Enter new price" ng-pattern="/(^[0-9]+$)|(^[0-9]+[.]{1}[0-9]+$)/"/>'
					},
					{
						name: 'Add/Remove',
						enableFiltering: false,
						cellTemplate: '<a href="" ng-click="grid.appScope.removeItem(row.entity.name, row.entity.category, row.entity.price)"' +
						'><span class="glyphicon glyphicon-remove"></span></a>',
						enableCellEdit: false,
						footerCellTemplate: '<a href="" ng-click="grid.appScope.addItem()"> <span class="glyphicon glyphicon-plus"></span> </a>'
					}
				];
			});
		};
		/******************************************************************************************************/
		$scope.showGiftcard = function(){
			$scope.admin.giftcard.newgc = '';
			$scope.admin.item.newgcprice = '';
			$scope.admin.item.errorMessage = '';
			$scope.admin.item.isError = false;
			AdminPageServices.getAll($scope, 'giftcard');
		};
		$scope.admin.giftcard.gridOptions.onRegisterApi = function (gridApi) {
			$scope.admin.giftcard.gridApi = gridApi;
		};
		$scope.admin.giftcard.onchange = function(){
			$scope.admin.giftcard.isError = false;
			$scope.admin.giftcard.errorMessage = '';
		};
		$scope.initGiftcard = function(){
			$scope.getAll('giftcard').then(function(){
				$scope.admin.giftcard.gridOptions.columnDefs = [
					{
						name: 'Gift card number' ,
						field: 'number'
					},
					{
						name: 'Balance' ,
						enableFiltering: false,
						cellFilter: 'priceFilter',
						field: 'amount'
					},
					{
						name: 'Remove',
						enableFiltering: false,
						cellTemplate: '<a href="" ng-click="grid.appScope.removeGiftcard(row.entity.number)"' +
						'><span class="glyphicon glyphicon-remove"></span></a>'
					}
				];
			});
		};
		/******************************************************************************************************/
		$scope.showReport = function(){
			$scope.admin.page = 'report';
			$scope.admin.report.pdf = undefined;
		};
		$scope.initReport = function() {
			$scope.admin.report.date = new Date();
			$scope.admin.report.open = false;
		};
		$scope.today = function() {
			$scope.dt = new Date();
		};
		$scope.clear = function () {
			$scope.dt = null;
		};
		$scope.open = function($event) {
			$scope.admin.report.open = !$scope.admin.report.open;
		};
		$scope.generateReport = function () {
			console.log('creating reports');
			var body = {
				'type': 'getReport',
				'reportType': $scope.admin.report.selectedOption,
				'giftcardNum': $scope.admin.report.giftcardNum,
				date: $scope.admin.report.date
			};
			console.log('generating report');
			$scope.admin.report.pdf = undefined;
			RetrieveInventory.load(body, function(response){
				$scope.admin.report.pdf = response[0].pdf;
				console.log('getReport');
			})
		};
		/******************************************************************************************************/
		/*Scroller Initialization*/
		$scope.initFTScroller = function(id) {
			var containerElement = document.getElementById(id);
			console.log(containerElement);
			setTimeout(function() {
				var scroller = new FTScroller(containerElement, {
					//contentHeight: 160,
					alwaysScroll: true,
					scrollingY: false
				});
			}, 100);
		};

		$scope.initFTScrollerGrid = function(id) {
			setTimeout(function() {
				var containerElement = document.querySelector("#" + id + " .ui-grid-viewport");
				console.log(containerElement);
				var scroller = new FTScroller(containerElement, {
					alwaysScroll: true,
					scrollingX: false,
				});
			}, 100);
		}
	}

]);
