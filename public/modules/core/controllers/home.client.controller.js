'use strict';


angular.module('core').controller('HomeController', [
	'$scope', '$state', 'Authentication', 'UserService', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
	'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$modal', '$compile', 'uiCalendarConfig',
	'RetrieveAppointments', 'FTScroller', 'hidScanner', 'RetrievePointcard', 'RetrieveStock',
	function(
			$scope, $state, Authentication, UserService, RetrieveEmployee, RetrieveInventory, MainpageServices,
			LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $modal, $compile, uiCalendarConfig,
			RetrieveAppointments, FTScroller, hidScanner, RetrievePointcard, RetrieveStock
	) {

		// Inject UserService into $scope
		$scope.UserService = UserService;

		// Function to check if in specified State, used to render menu items
		$scope.inState = function(state) {
			return $state.current.name.indexOf(state) >= 0;
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
		$scope.userLogout = function(){
			$scope.logoutModal().then(function(response){
				if (response === 'yes'){
					$state.go('core.login');
					//$scope.logOut();
				}
			});
		};
		$scope.logoutModal = function () {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/core/views/logoutModal.client.view.html',
				controller: 'logoutCtrl'
			});
			editorInstance.result.then(function (response) {
				deferred.resolve(response);
			});
			return deferred.promise;
		};
		$scope.logOut = function(){
			hidScanner.destroy();
			$scope.view = 'numpad';
			$scope.data.customerName = '';
			$scope.data.customerPhone = '';
			$scope.data.customerEmail = '';
			$scope.data.customerID = '';
			$scope.data.selectedEmployee = '';
			$scope.data.employees = [];
			$scope.data.isTax = true;
			$scope.data.subtotal = 0;
			$scope.data.tax = 0;
			$scope.data.password = '';
			$scope.data.order = '';
			$scope.data.index = 0;
			$scope.data.orders = [];
			$scope.data.categories = [];
			$scope.data.items = [];
			$scope.data.discount = '';
			$scope.data.discountPrice = 0;
			$scope.data.selectedPayment = 'Cash';
			$scope.data.ticketNumber = '';
			UserService.logoutUser();
			if (!$scope.inState('core.login')) {
				$state.go('^.login');
			}
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
			paymentTypes: ['Cash', 'DebitCard', 'CreditCard'],
			selectedPayment: 'Cash',
			ticketNumber: '',
			discount: '',
			discountPrice: 0,
			password : '',
			order: 0,
			index: 0,
			orders: [],
			categories: [],
			items: [],
			subtotal: 0,
			tax: 0,
			isTax: true,
			//if discountType is true: % else $
			discountType: true,
			employees: [],
			selectedEmployee: '',
			customerName: '',
			customerEmail: '',
			customerPhone: '',
			customerID: '',
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
			hidScanner.initialize($scope);
			// Check if not authenticated
			if (!UserService.getUser()) {
				$scope.logOut();
			}

			var body = {
				'type': 'retrieveCat'
			};
			RetrieveInventory.load(body, function(response){
				$scope.data.category = _.map(response, _.clone);
				$scope.data.orderModal().then(function(selectedItem){
					switch (selectedItem.message){
						case undefined:
						case 'no':
							$scope.view = 'numpad';
							break;
						case 'neworder':
							$scope.data.index = selectedItem.data;
							$scope.data.customerName = selectedItem.customer.name;
							$scope.data.customerEmail = selectedItem.customer.email;
							$scope.data.customerPhone = selectedItem.customer.phone;
							$scope.data.customerID = selectedItem.customer._id;
							$scope.data.subtotal = 0;
							$scope.data.tax = 0;
							break;
						case 'order':
							$scope.data.index = selectedItem.data.index;
							$scope.data.order = selectedItem.data._id;
							$scope.data.orders = selectedItem.data.orders;
							$scope.data.customerName = selectedItem.data.customerName;
							$scope.data.customerID = selectedItem.data.customerID;
							$scope.data.subtotal = selectedItem.data.subtotal;
							$scope.data.tax = selectedItem.data.tax;
							$scope.data.discountType = selectedItem.data.discountType;
							$scope.data.discount = selectedItem.data.discount;
							$scope.data.discountPrice = selectedItem.data.discountPrice;
							$scope.data.selectedPayment = selectedItem.data.paymentType;
							$scope.data.ticketNumber = (selectedItem.data.ticketNumber === undefined) ? '' : selectedItem.data.ticketNumber;
							break;
					}
				});
			});
		};
		$scope.$watch("data.subtotal", function(newValue, oldValue) {
			if (newValue !== undefined && oldValue !== undefined){
				if ($scope.data.discount !== undefined && $scope.data.discount !== ''){
					var discountPrice = 0;
					if ($scope.data.discountType){
						var discount = parseInt($scope.data.discount) / 100;
						_.each($scope.data.orders, function(order){
							if (!order.isGiftcard && !order.isPointcard){
								discountPrice += order.price * order.quantity * discount;
							}
						});
						if ($scope.data.isTax){
							discountPrice = discountPrice * 1.13;
						}
						$scope.data.discountPrice = discountPrice;
					}else{
						$scope.data.discountPrice = parseInt($scope.data.discount);
					}
				}else if ($scope.data.discount !== undefined && $scope.data.discount === ''){
					$scope.data.discountPrice = 0;
				}
			}
		});
		$scope.$watch("data.tax", function(newValue, oldValue) {
			if (newValue !== undefined && oldValue !== undefined){
				if (!$scope.data.isTax){
					$scope.data.tax = 0;
				}else{
					$scope.data.tax = 0;
					_.each($scope.data.orders, function(order){
						if (!order.isGiftcard && !order.isPointcard){
							$scope.data.tax += order.price*order.quantity*0.13;
						}
					});
				}
				if ($scope.data.discount !== undefined && $scope.data.discount !== ''){
					var discountPrice = 0;
					if ($scope.data.discountType){
						var discount = parseInt($scope.data.discount) / 100;
						_.each($scope.data.orders, function(order){
							if (!order.isGiftcard && !order.isPointcard){
								discountPrice += order.price * order.quantity * discount;
							}
						});
						if ($scope.data.isTax){
							discountPrice = discountPrice * 1.13;
						}
						$scope.data.discountPrice = discountPrice;
					}else{
						$scope.data.discountPrice = parseInt($scope.data.discount);
					}
				}else if ($scope.data.discount !== undefined && $scope.data.discount === ''){
					$scope.data.discountPrice = 0;
				}
			}
		});
		$scope.data.getTax = function(){
			if (!$scope.data.isTax){
				$scope.data.tax = 0;
			}else{
				$scope.data.tax = 0;
				_.each($scope.data.orders, function(order){
					if (!order.isGiftcard && !order.isPointcard){
						$scope.data.tax += order.price*order.quantity*0.13;
					}
				});
			}
		};
		$scope.data.orderModal = function(){
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow modal-order',
				templateUrl: 'modules/core/views/orderModal.client.view.html',
				controller: 'orderCtrl',
				backdrop : 'static',
				keyboard: false,
				resolve: {
					currentUser : function(){
						return UserService.getUser().name;
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
			if (!item.isGiftcard && !item.isPointcard){
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
		$scope.data.usePointCard = function () {
			$scope.data.usePointCardModal().then(function(pointcard){
				if (pointcard !== undefined){
					pointcard.name = 'Point Card ' + pointcard.number;
					pointcard.price = 0;
					pointcard.isPointcard = true;
					pointcard.pcNumber = pointcard.number;
					pointcard.pcType = 'Use';
					MainpageServices.addItem($scope, pointcard);
				}
			});
		};
		$scope.data.usePointCardModal = function () {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/core/views/modal/usePointcardModal.client.view.html',
				controller: 'usePointcardCtrl',
			});
			editorInstance.result.then(function (pointcard) {
				deferred.resolve(pointcard);
			});
			return deferred.promise;
		};
		$scope.data.redeemPointCard = function () {
			$scope.data.redeemPointCardModal().then(function(pointcard){
				if (pointcard !== undefined){
					pointcard.name = 'Redeem Point Card ' + pointcard.number;
					pointcard.price = -pointcard.price;
					pointcard.isPointcard = true;
					pointcard.pcNumber = pointcard.number;
					pointcard.pcType = 'Redeem';
					pointcard.pcRedeem = pointcard.pointredeem;
					MainpageServices.addItem($scope, pointcard);
				}
			});
		};
		$scope.data.redeemPointCardModal = function () {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/core/views/modal/redeemPointcardModal.client.view.html',
				controller: 'redeemPointcardCtrl'
			});
			editorInstance.result.then(function (pointcard) {
				deferred.resolve(pointcard);
			});
			return deferred.promise;
		};
		$scope.data.useGiftcard = function () {
			$scope.data.useGiftcardModal().then(function(giftcard){
				if (giftcard !== undefined){
					giftcard.name = 'Giftcard ' + giftcard.number;
					giftcard.price = - giftcard.amount;
					giftcard.isGiftcard = true;
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
				var server = {'name' : ''};
				if ($scope.data.selectedEmployee === undefined || $scope.data.selectedEmployee === ''){
					server = UserService.getUser();
				}else{
					server = {'name' : $scope.data.selectedEmployee};
				}
				if (selectedItem === 'yes'){
					var body = {
						'type': 'doneOrder',
						'order': $scope.data.order,
						'orders': $scope.data.orders,
						'user': server,
						'customerName': $scope.data.customerName,
						'customerID': $scope.data.customerID,
						'subtotal': $scope.data.subtotal,
						'tax': $scope.data.tax,
						'isTax': $scope.data.isTax,
						'discountPrice' : $scope.data.discountPrice,
						'paymentType': $scope.data.selectedPayment
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
			var server = {'name' : ''};
			if ($scope.data.selectedEmployee === undefined || $scope.data.selectedEmployee === ''){
				server = UserService.getUser();
			}else{
				server = {'name' : $scope.data.selectedEmployee};
			}
			var body = {
				'type': 'printReceipt',
				'id': $scope.data.order,
				'order': $scope.data.index,
				'orders': $scope.data.orders,
				'user': server,
				'actualEmployee': UserService.getUser(),
				'customerName': $scope.data.customerName,
				'subtotal': $scope.data.subtotal,
				'tax': $scope.data.tax,
				'paymentType': $scope.data.selectedPayment,
				'discount': $scope.data.discount,
				'discountPrice': $scope.data.discountPrice,
				'customerID': $scope.data.customerID,
				'ticketNumber': $scope.data.ticketNumber
			};
			RetrieveInventory.load(body, function(response){
				console.log(response);
				$scope.data.order = response[0];
			});
		};
		$scope.applyDiscount = function(){
			if ($scope.data.discount !== undefined && $scope.data.discount !== ''){
				var discountPrice = 0;
				if ($scope.data.discountType){
					var discount = parseInt($scope.data.discount) / 100;
					_.each($scope.data.orders, function(order){
						if (!order.isGiftcard && !order.isPointcard){
							discountPrice += order.price * order.quantity * discount;
						}
					});
					if ($scope.data.isTax){
						discountPrice = discountPrice * 1.13;
					}
					$scope.data.discountPrice = discountPrice;
				}else{
					$scope.data.discountPrice = parseInt($scope.data.discount);
				}
			}else if ($scope.data.discount !== undefined && $scope.data.discount === ''){
				$scope.data.discountPrice = 0;
			}
		};
		var guid = function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		};
		$scope.$on("hidScanner::scanned", function(event, args) {
			if (args.barcode.length === 6 && !isNaN(args.barcode)){
				var body = {
					type: 'getItemWithBarcode',
					barcode: parseInt(args.barcode)
				};
				RetrieveStock.load(body, function(response){
					if (response[0]._id !== undefined){
						MainpageServices.addItem($scope, response[0]);
					}
				});
			}else{
				var body = {
					type: 'getPointcard',
					number: args.barcode
				};
				RetrievePointcard.load(body, function(response){
					if (response[0].number !== undefined){
						var verifyPC = _.find($scope.data.orders, function(pc){
							return (pc.pcNumber !== undefined && pc.pcNumber === response[0].number);
						});
						if (verifyPC === undefined){
							var pointcard = {number: response[0].number, _id: guid()};
							pointcard.name = 'Point Card ' + pointcard.number;
							pointcard.price = 0;
							pointcard.isPointcard = true;
							pointcard.pcNumber = pointcard.number;
							pointcard.pcType = 'Use';
							MainpageServices.addItem($scope, pointcard);
						}
					}
				})
			}
		});
		/******************************************************************************************************/
		/*Scroller Initialization*/
		$scope.initFTScroller = FTScroller.initFTScroller;
		$scope.initFTScrollerGrid = FTScroller.initFTScrollerGrid;
	}

]);
