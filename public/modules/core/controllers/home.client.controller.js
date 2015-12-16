'use strict';


angular.module('core').controller('HomeController', [
	'$scope', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
	'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$modal', '$compile', 'uiCalendarConfig',
		'RetrieveAppointments',
	function(
		$scope, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
		LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $modal, $compile, uiCalendarConfig,
		RetrieveAppointments
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
		$scope.view = 'numpad';
		$scope.logOut = function(){
			$scope.view = 'numpad';
			$scope.data.customerName = '';
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
		/*Scheduler Page*/
		$scope.navigateSchedulerPage = function() {
			$scope.view = 'scheduler';
			$scope.initScheduler();
		};
		$scope.scheduler = {
			selectedEvent: false, //if user clicked on an event
			events: [],
			eventSources: [],
			employees: [],
			hourList: [
				'12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30',
				'5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30',
				'9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
			timeList: ['AM', 'PM'],
			new: {
				id: '',
				customerName: '',
				assignedEmployee: {},
				startTime: '12:00',
				startTimeList: 'AM',
				startDate: new Date(),
				startOpen: false,
				endTime: '12:00',
				endTimeList: 'AM',
				endDate: new Date(),
				endOpen: false,
				note: ''
			},
			selected: {
				id: '',
				customerName: '',
				assignedEmployee: {},
				startTime: '12:00',
				startTimeList: 'AM',
				startDate: new Date(),
				startOpen: false,
				endTime: '12:00',
				endTimeList: 'AM',
				endDate: new Date(),
				endOpen: false,
				note: ''
			}
		};
		$scope.scheduler.openCalender = function(event){
			switch (event){
				case 'newStart':
					$scope.scheduler.new.startOpen = !$scope.scheduler.new.startOpen;
					break;
				case 'newEnd':
					$scope.scheduler.new.endOpen = !$scope.scheduler.new.endOpen;
					break;
				case 'selectedStart':
					$scope.scheduler.selected.startOpen = !$scope.scheduler.selected.startOpen;
					break;
				case 'selectedEnd':
					$scope.scheduler.selected.endOpen = !$scope.scheduler.selected.endOpen;
					break;
			}
		};
		$scope.initScheduler = function(){
			$scope.scheduler.events = [];
			$scope.scheduler.eventSources = [$scope.scheduler.events];
			var body = {
				'type': 'getAll'
			};
			RetrieveEmployee.load(body, function(response){
				_.each(response, function(employee){
					$scope.scheduler.employees.push({id: employee._id, name: employee.name});
				});
				$scope.scheduler.new.assignedEmployee = $scope.scheduler.employees[0];
			});
			RetrieveAppointments.load(body, function(response){
				_.each(response, function(appointment){
					var startDate = new Date(appointment.startDate);
					var endDate = new Date(appointment.endDate);
					function setHours (d, startTime, timeList){
						d.setHours(0,0,0,0);
						var index = startTime.indexOf(':');
						var hour = parseInt(startTime.substring(0,index)) % 12;
						if (timeList === 'PM'){
							hour += 12;
						}
						var min = parseInt(startTime.substring(index+1));
						d.setHours(hour);
						d.setMinutes(min);
					}
					setHours(startDate, appointment.startTime, appointment.startTimeList);
					setHours(endDate, appointment.endTime, appointment.endTimeList);
					$scope.scheduler.events.push({
						title: $scope.scheduler.new.assignedEmployee.name + ' - ' + appointment.customerName,
						start: startDate,
						end: endDate,
						data: {
							id: appointment._id,
							customerName: appointment.customerName,
							startTime: appointment.startTime,
							startTimeList: appointment.startTimeList,
							startDate: startDate,
							endTime: appointment.endTime,
							endTimeList: appointment.endTimeList,
							endDate: endDate,
							assignedEmployee: appointment.assignedEmployee,
							note: appointment.note
						}
					});
				})
			});

		};
		$scope.addNewEvent = function() {
			var startDate = new Date($scope.scheduler.new.startDate);
			var endDate = new Date($scope.scheduler.new.endDate);
			function setHours (d, startTime, timeList){
				d.setHours(0,0,0,0);
				var index = startTime.indexOf(':');
				var hour = parseInt(startTime.substring(0,index)) % 12;
				if (timeList === 'PM'){
					hour += 12;
				}
				var min = parseInt(startTime.substring(index+1));
				d.setHours(hour);
				d.setMinutes(min);
			}
			setHours(startDate, $scope.scheduler.new.startTime, $scope.scheduler.new.startTimeList);
			setHours(endDate, $scope.scheduler.new.endTime, $scope.scheduler.new.endTimeList);
			var body = {
				'type': 'add',
				customerName: $scope.scheduler.new.customerName,
				startTime: $scope.scheduler.new.startTime,
				startTimeList: $scope.scheduler.new.startTimeList,
				startDate: startDate,
				endTime: $scope.scheduler.new.endTime,
				endTimeList: $scope.scheduler.new.endTimeList,
				endDate: endDate,
				assignedEmployee: $scope.scheduler.new.assignedEmployee,
				note: $scope.scheduler.new.note
			};
			RetrieveAppointments.load(body, function(response){
				$scope.scheduler.events.push({
					title: $scope.scheduler.new.assignedEmployee.name + ' - ' + $scope.scheduler.new.customerName,
					start: startDate,
					end: endDate,
					data: {
						id: response[0]._id,
						customerName: $scope.scheduler.new.customerName,
						startTime: $scope.scheduler.new.startTime,
						startTimeList: $scope.scheduler.new.startTimeList,
						startDate: startDate,
						endTime: $scope.scheduler.new.endTime,
						endTimeList: $scope.scheduler.new.endTimeList,
						endDate: endDate,
						assignedEmployee: $scope.scheduler.new.assignedEmployee,
						note: $scope.scheduler.new.note
					}
				});
				$scope.scheduler.new.id = '';
				$scope.scheduler.new.assignedEmployee = $scope.scheduler.employees[0];
				$scope.scheduler.new.customerName = '';
				$scope.scheduler.new.startTime = '12:00';
				$scope.scheduler.new.startTimeList = 'AM';
				$scope.scheduler.new.startDate = new Date();
				$scope.scheduler.new.startOpen = false;
				$scope.scheduler.new.endTime = '12:00';
				$scope.scheduler.new.endTimeList = 'AM';
				$scope.scheduler.new.endDate = new Date();
				$scope.scheduler.new.endOpen = false;
				$scope.scheduler.new.note = '';

			});
		};
		$scope.updateEvent = function() {
			var event = _.find($scope.scheduler.events, function(e){
				return e.data.id === $scope.scheduler.selected.id;
			});
			var startDate = new Date($scope.scheduler.selected.startDate);
			var endDate = new Date($scope.scheduler.selected.endDate);
			function setHours (d, startTime, timeList){
				d.setHours(0,0,0,0);
				var index = startTime.indexOf(':');
				var hour = parseInt(startTime.substring(0,index)) % 12;
				if (timeList === 'PM'){
					hour += 12;
				}
				var min = parseInt(startTime.substring(index+1));
				d.setHours(hour);
				d.setMinutes(min);
			}
			setHours(startDate, $scope.scheduler.selected.startTime, $scope.scheduler.selected.startTimeList);
			setHours(endDate, $scope.scheduler.selected.endTime, $scope.scheduler.selected.endTimeList);
			var body = {
				type: 'update',
				id: event.data.id,
				customerName: $scope.scheduler.selected.customerName,
				startTime: $scope.scheduler.selected.startTime,
				startTimeList: $scope.scheduler.selected.startTimeList,
				startDate: startDate,
				endTime: $scope.scheduler.selected.endTime,
				endTimeList: $scope.scheduler.selected.endTimeList,
				endDate: endDate,
				assignedEmployee: $scope.scheduler.selected.assignedEmployee,
				note: $scope.scheduler.selected.note
			};
			RetrieveAppointments.load(body, function(response){
				event.data.customerName = $scope.scheduler.selected.customerName;
				event.data.startTime = $scope.scheduler.selected.startTime;
				event.data.startTimeList = $scope.scheduler.selected.startTimeList;
				event.data.startDate = startDate;
				event.data.endTime = $scope.scheduler.selected.endTime;
				event.data.endTimeList = $scope.scheduler.selected.endTimeList;
				event.data.endDate = endDate;
				event.data.assignedEmployee = $scope.scheduler.selected.assignedEmployee;
				event.data.note = $scope.scheduler.selected.note;
				event.title = event.data.assignedEmployee.name + ' - ' + event.data.customerName;
				event.start = event.data.startDate;
				event.end = event.data.endDate;
			});
		};
		$scope.deleteEvent = function(){
			var event = _.find($scope.scheduler.events, function(e){
				return e.data.id === $scope.scheduler.selected.id;
			});
			var body = {
				type: 'delete',
				id: event.data.id
			};
			RetrieveAppointments.load(body, function(response){
				var index = _.findIndex($scope.scheduler.events, function(e){
					return e.data.id === $scope.scheduler.selected.id;
				});
				$scope.scheduler.events.splice(index,1);
				$scope.scheduler.selectedEvent = false;
			});
		};
		/* alert on eventClick */
		$scope.scheduler.alertOnEventClick = function( date, jsEvent, view){
			$scope.scheduler.selectedEvent = true;
			$scope.scheduler.selected.id = date.data.id;
			$scope.scheduler.selected.assignedEmployee = date.data.assignedEmployee;
			$scope.scheduler.selected.customerName = date.data.customerName;
			$scope.scheduler.selected.startTime = date.data.startTime;
			$scope.scheduler.selected.startTimeList = date.data.startTimeList;
			$scope.scheduler.selected.startDate = date.data.startDate;
			$scope.scheduler.selected.startOpen = false;
			$scope.scheduler.selected.endTime = date.data.endTime;
			$scope.scheduler.selected.endTimeList = date.data.endTimeList;
			$scope.scheduler.selected.endDate = date.data.endDate;
			$scope.scheduler.selected.endOpen = false;
			$scope.scheduler.selected.note = date.data.note;
			// Hide add pane
			$scope.addPaneHidden = true;
		};
		/* alert on Drop */
		$scope.scheduler.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
			function updateDate(d){
				var newDate = moment(d);
				newDate.add(delta._data.days, 'days');
				newDate.add(delta._data.hours, 'hours');
				newDate.add(delta._data.milliseconds, 'milliseconds');
				newDate.add(delta._data.minutes, 'minutes');
				newDate.add(delta._data.months, 'months');
				newDate.add(delta._data.seconds, 'seconds');
				newDate.add(delta._data.years, 'years');
				return newDate;
			}
			function updateTime(d){
				var h = moment(d).hour() % 12;
				var m = moment(d).minute();
				if (m === 0){
					m = '00';
				}else{
					m = '30';
				}
				if (h === 0){
					return '12:' + m;
				}else{
					return h.toString() + ':' + m;
				}
			}
			function updateTimeList(d){
				var h = moment(d).hour();
				if (h < 12){
					return 'AM';
				}else{
					return 'PM';
				}
			}
			var startDate = updateDate(event.data.startDate);
			var endDate = updateDate(event.data.endDate);
			var startTime = updateTime(startDate);
			var endTime = updateTime(endDate);
			var startTimeList = updateTimeList(startDate);
			var endTimeList = updateTimeList(endDate);
			var body = {
				type: 'update',
				id: event.data.id,
				customerName: event.data.customerName,
				startTime: startTime,
				startTimeList: startTimeList,
				startDate: startDate._d,
				endTime: endTime,
				endTimeList: endTimeList,
				endDate: endDate._d,
				assignedEmployee: event.data.assignedEmployee,
				note: event.data.note
			};
			RetrieveAppointments.load(body, function(response){
				var updateEvent = _.find($scope.scheduler.events, function(e){
					return e.data.id === event.data.id;
				});
				updateEvent.data.startTime = startTime;
				updateEvent.data.startTimeList = startTimeList;
				updateEvent.data.startDate = startDate._d;
				updateEvent.data.endTime = endTime;
				updateEvent.data.endTimeList = endTimeList;
				updateEvent.data.endDate = endDate._d;
				$scope.scheduler.selected.startTime = startTime;
				$scope.scheduler.selected.startTimeList = startTimeList;
				$scope.scheduler.selected.startDate = startDate._d;
				$scope.scheduler.selected.endTime = endTime;
				$scope.scheduler.selected.endTimeList = endTimeList;
				$scope.scheduler.selected.endDate = endDate._d;
			});
		};
		/* alert on Resize */
		$scope.scheduler.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
			function updateDate(d){
				var newDate = moment(d);
				newDate.add(delta._data.days, 'days');
				newDate.add(delta._data.hours, 'hours');
				newDate.add(delta._data.milliseconds, 'milliseconds');
				newDate.add(delta._data.minutes, 'minutes');
				newDate.add(delta._data.months, 'months');
				newDate.add(delta._data.seconds, 'seconds');
				newDate.add(delta._data.years, 'years');
				return newDate;
			}
			function updateTime(d){
				var h = moment(d).hour() % 12;
				var m = moment(d).minute();
				if (m === 0){
					m = '00';
				}else{
					m = '30';
				}
				if (h === 0){
					return '12:' + m;
				}else{
					return h.toString() + ':' + m;
				}
			}
			function updateTimeList(d){
				var h = moment(d).hour();
				if (h < 12){
					return 'AM';
				}else{
					return 'PM';
				}
			}
			var endDate = updateDate(event.data.endDate);
			var endTime = updateTime(endDate);
			var endTimeList = updateTimeList(endDate);
			var body = {
				type: 'update',
				id: event.data.id,
				customerName: event.data.customerName,
				startTime: event.data.startTime,
				startTimeList: event.data.startTimeList,
				startDate: event.data.startDate,
				endTime: endTime,
				endTimeList: endTimeList,
				endDate: endDate._d,
				assignedEmployee: event.data.assignedEmployee,
				note: event.data.note
			};
			RetrieveAppointments.load(body, function(response){
				var updateEvent = _.find($scope.scheduler.events, function(e){
					return e.data.id === event.data.id;
				});
				updateEvent.data.endTime = endTime;
				updateEvent.data.endTimeList = endTimeList;
				updateEvent.data.endDate = endDate._d;
				$scope.scheduler.selected.endTime = endTime;
				$scope.scheduler.selected.endTimeList = endTimeList;
				$scope.scheduler.selected.endDate = endDate._d;
			});
		};
		/* Change View */
		$scope.scheduler.changeView = function(view,calendar) {
			uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
		};
		/* Add New Calendar Btn Event */
		$scope.addPaneHidden = true;
		$scope.scheduler.alertOnAddBtnClicked = function() {
			$scope.addPaneHidden = !$scope.addPaneHidden;
			console.log($scope.addPaneHidden);
		};
		/* config object */
		$scope.uiConfig = {
			calendar:{
				height: 800,
				editable: true,
				header:{
					left: '',
					center: 'title',
					right: 'today prev,next'
				},
				slotDuration: '00:10:00',
				eventClick: $scope.scheduler.alertOnEventClick,
				eventDrop: $scope.scheduler.alertOnDrop,
				eventResize: $scope.scheduler.alertOnResize
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
			isTax: true,
			employees: [],
			selectedEmployee: '',
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
		$scope.$watch("data.tax", function(newValue, oldValue) {
			if (newValue !== undefined && oldValue !== undefined){
				if (!$scope.data.isTax){
					$scope.data.tax = 0;
				}else{
					$scope.data.tax = 0;
					_.each($scope.data.orders, function(order){
						if (!order.isGiftcard){
							$scope.data.tax += order.price*order.quantity*0.13;
						}
					});
				}
			}
		});
		$scope.data.getTax = function(){
			if (!$scope.data.isTax){
				$scope.data.tax = 0;
			}else{
				$scope.data.tax = 0;
				_.each($scope.data.orders, function(order){
					if (!order.isGiftcard){
						$scope.data.tax += order.price*order.quantity*0.13;
					}
				});
			}
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
				var server = {'name' : ''};
				if ($scope.data.selectedEmployee === undefined || $scope.data.selectedEmployee === ''){
					server = $scope.data.currentUser;
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
						'subtotal': $scope.data.subtotal,
						'tax': $scope.data.tax,
						'isTax': $scope.data.isTax
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
				server = $scope.data.currentUser;
			}else{
				server = {'name' : $scope.data.selectedEmployee};
			}
			var body = {
				'type': 'printReceipt',
				'order': $scope.data.index,
				'orders': $scope.data.orders,
				'user': server,
				'customerName': $scope.data.customerName,
				'subtotal': $scope.data.subtotal,
				'tax': $scope.data.tax
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
		$scope.showDashboard = function(){
			$scope.admin.page = 'setting';
			$scope.admin.setting.isError = false;
			$scope.admin.setting.errorMessage = '';
			$scope.admin.setting.newpasscode = '';
			$scope.admin.setting.newpasscode_repeat = '';
		};
		$scope.changepassword = function(){
			AdminPageServices.changepassword($scope, $scope.admin.setting.passcode, $scope.admin.setting.newpasscode, $scope.admin.setting.newpasscode_repeat)
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
