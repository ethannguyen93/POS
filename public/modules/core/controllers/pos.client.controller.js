'use strict';

// Controller for main POS
angular.module('core').controller('POSController', [
	'$scope', '$state', 'Authentication', 'POSData', 'UserService', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
	'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$compile', 'uiCalendarConfig',
	'RetrieveAppointments', 'FTScroller', 'hidScanner', 'RetrievePointcard', 'RetrieveStock', 'GUID', 'Modals', 'Config',
	function(
		$scope, $state, Authentication, POSData, UserService, RetrieveEmployee, RetrieveInventory, MainpageServices,
		LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $compile, uiCalendarConfig,
		RetrieveAppointments, FTScroller, hidScanner, RetrievePointcard, RetrieveStock, GUID, Modals, Config
	) {
		$scope.config = Config;
		/*User Main Page*/
		$scope.data = POSData.init();

		$scope.data.gridOptions.onRegisterApi = function (gridApi) {
			$scope.data.gridApi = gridApi;
		};

		$scope.addCustomItem = function(){
			Modals.openCustomItemModal().then(function(item){
				if (item.name && item.price){
					var prevItem = _.find($scope.data.orders, function(i){
						return (i.name === item.name && i.price === item.price);
					});
					if (prevItem) {
						item._id = prevItem._id;
					}else{
						item._id = GUID.create();
					}
					MainpageServices.addItem($scope, item);
				}
			});
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
					field: 'name',
					footerCellTemplate: '<a href="" ng-click="grid.appScope.addCustomItem()"> <span class="glyphicon glyphicon-plus"></span> </a>'
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
			var user = UserService.getUser();
			if (!user) {
				$scope.logOut();
			} else if (user.isAdmin) {
				RetrieveEmployee.load({ type: 'getAll' }, function (response) {
					var employees = [];
					_.each(response, function (res) {
						employees.push(res.name);
					});
					$scope.data.employees = employees;
					$scope.data.selectedEmployee = employees[0];
				});
			}
			loadCategories();
		};

		// Loads Item Categories
		function loadCategories() {
			RetrieveInventory.load({'type': 'retrieveCat'}, function (response) {
				$scope.data.category = _.map(response, _.clone);
				initOrderType();
			});
		}

		// Initializes Order based on type: New, Existing, Ticket-based
		function initOrderType() {
			if (!$scope.config.ORDER_MODAL_ACTIVE) {
				return;
			}

			Modals.openOrderModal().then(function (selectedItem) {
				switch (selectedItem.message) {
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
						$scope.data.id = selectedItem.data._id;
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
		}
		
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
						$scope.data.discountPrice = discountPrice;
					}else{
						$scope.data.discountPrice = parseInt($scope.data.discount);
					}
				}else if ($scope.data.discount !== undefined && $scope.data.discount === ''){
					$scope.data.discountPrice = 0;
				}
				if ($scope.data.isTax){
					$scope.data.tax += -$scope.data.discountPrice * 0.13;
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
						$scope.data.discountPrice = discountPrice;
					}else{
						$scope.data.discountPrice = parseInt($scope.data.discount);
					}
				}else if ($scope.data.discount !== undefined && $scope.data.discount === ''){
					$scope.data.discountPrice = 0;
				}
				if ($scope.data.isTax){
					$scope.data.tax += -$scope.data.discountPrice * 0.13;
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

		$scope.getItem = function(cat){
			MainpageServices.getItem($scope, cat);
		};

		$scope.addItemToOrder = function(item){
			var result = MainpageServices.addItem($scope, item);
			if (result.alert) {
				Modals.openNotificationModal(result.alert);
			}
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
			Modals.openCheckBalanceModal();
		};

		$scope.data.buyGiftcard = function () {
			Modals.openBuyGiftCardModal().then(function(giftcard){
				if (giftcard !== undefined){
					giftcard.name = 'Giftcard ' + giftcard.number + ' - ' + giftcard.type;
					giftcard.price = giftcard.amount;
					MainpageServices.addItem($scope, giftcard);
				}
			});
		};

		$scope.data.usePointCard = function () {
			Modals.openPointCardModal().then(function(pointcard){
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

		$scope.data.redeemPointCard = function () {
			Modals.openRedeemPointCardModal().then(function(pointcard){
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

		$scope.data.useGiftcard = function () {
			Modals.openUseGiftCardModal().then(function(giftcard){
				if (giftcard !== undefined){
					giftcard.name = 'Giftcard ' + giftcard.number;
					giftcard.price = - giftcard.amount;
					giftcard.isGiftcard = true;
					MainpageServices.addItem($scope, giftcard);
				}
			});
		};

		$scope.data.saveOrder = function () {
			Modals.openSaveOrderModal().then(function(result) {
				if (result === 'yes') {
					MainpageServices.saveOrder($scope);
					$scope.logOut();
				}
			});
		};
		
		$scope.data.doneOrder = function () {
			Modals.openDoneOrderModal($scope.data).then(function(selectedItem){
				var server = {'name' : ''};
				if ($scope.data.selectedEmployee === undefined || $scope.data.selectedEmployee === ''){
					server = UserService.getUser();
				}else{
					server = {'name' : $scope.data.selectedEmployee};
				}
				if (selectedItem === 'yes'){
					var body = {
						'type': 'doneOrder',
						'id': $scope.data.id,
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

		$scope.data.printReceipt = function () {
			Modals.printingModal($scope.data)
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
					$scope.data.discountPrice = discountPrice;
				}else{
					$scope.data.discountPrice = parseInt($scope.data.discount);
				}
			}else if ($scope.data.discount !== undefined && $scope.data.discount === ''){
				$scope.data.discountPrice = 0;
			}
			if ($scope.data.isTax){
				$scope.data.tax += -$scope.data.discountPrice * 0.13;
			}
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
							var pointcard = {number: response[0].number, _id: GUID.create()};
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

		$scope.updateTaxable = function () {
			if ($scope.data.selectedPayment !== 'Cash') {
				$scope.data.isCash = true;
				$scope.data.isTax = true;
				$scope.data.getTax();
			} else {
				$scope.data.isCash = false;
			}
		};

		/******************************************************************************************************/
		/*Scroller Initialization*/
		$scope.initFTScroller = FTScroller.initFTScroller;
		$scope.initFTScrollerGrid = FTScroller.initFTScrollerGrid;
	}

]);
