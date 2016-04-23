'use strict';

// Customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers', '$q', '$modal', 'RetrieveCustomer',
	function($scope, $stateParams, $location, Authentication, Customers, $q, $modal, RetrieveCustomer) {

		$scope.gridOptions = {
			rowHeight: 60,
			columnFooterHeight: 60,
			showColumnFooter: true,
			enableFiltering: true,
			enablePaginationControls: false,
			paginationPageSize: 10,
			data: 'data.customers'
		};

		$scope.data = {
			customers: [],
			isError: false,
			errorMessage: '',
			new: {
				name: '',
				phone: '',
				email: '',
				address: ''
			}
		};
		$scope.reset = function(){
			$scope.data.isError = false;
			$scope.data.errorMessage = '';
		};
		$scope.addCustomer = function(){
			if ($scope.data.new.name === ''){
				$scope.data.isError = true;
				$scope.data.errorMessage = 'Please enter customer name';
			}else if ($scope.data.new.phone === '' && $scope.data.new.email === '') {
				$scope.data.isError = true;
				$scope.data.errorMessage = 'Please enter either phone number or email address';
			}else{
				var body = {
					type: 'getCustomer',
					name: $scope.data.new.name,
					phone: $scope.data.new.phone,
					email: $scope.data.new.email,
					address: $scope.data.new.address
				};
				RetrieveCustomer.load(body, function(response){
					if (response[0].name === undefined){
						body.type = 'addCustomer';
						RetrieveCustomer.load(body, function(response){
							$scope.data.customers.push(response[0]);
						});
						$scope.data.new = {
							name: '',
							phone: '',
							email: '',
							address: ''
						}
					}else{
						$scope.data.isError = true;
						$scope.data.errorMessage = 'Customer is already existed';
					}
				})
			}
		};

		$scope.initCustomer = (function(){
			$scope.gridOptions.columnDefs = [
				{
					name: 'Name',
					field: 'name',
					footerCellTemplate: '<input ng-model="grid.appScope.data.new.name" ' +
					'ng-change="grid.appScope.reset()" placeholder="New name"/>'
				},
				{
					name: 'Phone',
					field: 'phone',
					footerCellTemplate: '<input ng-model="grid.appScope.data.new.phone" ' +
					'ng-change="grid.appScope.reset()" placeholder="New phone number"/>'
				},
				{
					name: 'Email',
					field: 'email',
					footerCellTemplate: '<input ng-model="grid.appScope.data.new.email" ' +
					'ng-change="grid.appScope.reset()" placeholder="New email address"/>'
				},
				{
					name: 'Address',
					field: 'address',
					footerCellTemplate: '<input ng-model="grid.appScope.data.new.address" ' +
					'ng-change="grid.appScope.reset()" placeholder="New home address"/>'
				},
				{
					name: 'Edit',
					enableFiltering: false,
					cellTemplate: '<a href="" ng-click="grid.appScope.editCustomer(row.entity.name, row.entity.phone, row.entity.email, row.entity.address, row.entity._id)"' +
					'><span class="glyphicon glyphicon-pencil"></span></a>'
				},
				{
					name: 'Photo',
					enableFiltering: false,
					field: 'image',
					cellTemplate: '<img data-ng-src="/customerImage/{{row.entity.image}}" data-ng-if="row.entity.image" height="100" width="100" ng-click="grid.appScope.openImage(row.entity)">',

				},
				{
					name: 'Take Picture',
					field: 'capture',
					cellTemplate: '<a href="" ng-click="grid.appScope.capturePhoto(row.entity)"' +
					'><span class="glyphicon glyphicon-camera"></span></a>',
					enableFiltering: false,
					enableCellEdit: false
				},
				{
					name: 'Add/Remove',
					enableFiltering: false,
					cellTemplate: '<a href="" ng-click="grid.appScope.removeCustomer(row.entity._id)"' +
					'><span class="glyphicon glyphicon-remove"></span></a>',
					footerCellTemplate: '<a href="" ng-click="grid.appScope.addCustomer()"> <span class="glyphicon glyphicon-plus"></span> </a>'
				}
			];
			var body = {
				type: 'getAll'
			};
			RetrieveCustomer.load(body, function(response){
				$scope.data.customers = [];
				_.each(response, function(customer){
					$scope.data.customers.push(customer);
				});
			});
		})();
		$scope.openImage = function(item){
			$modal.open({
				animation: true,
				windowClass: 'modal-image',
				templateUrl: 'modules/customers/views/modal/imageViewerModal.client.view.html',
				controller: function($scope) {
					$scope.image = item.image;
				}
			});
		};
		$scope.capturePhoto = function(item){
			$scope.capturePhotoModal(item._id).then(function(image){
				if (image){
					var random = (new Date()).toString();
					item.image = image + "?cb=" + random;
				}
			});
		};
		$scope.capturePhotoModal = function (id) {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow-capture',
				templateUrl: 'modules/customers/views/modal/capturePhotoModal.client.view.html',
				controller: 'CapturePhotoController',
				resolve: {
					customerID: function(){
						return id;
					}
				}
			});
			editorInstance.result.then(function (image) {
				deferred.resolve(image);
			});
			return deferred.promise;
		};
		$scope.editCustomer = function(name, phone, email, address, id){
			$scope.editCustomerModal(name, phone, email, address, id).then(function(customer){
				if (customer !== undefined){
					var c = _.find($scope.data.customers, function(c){
						return customer.id === c._id;
					});
					c.name = customer.name;
					c.phone = customer.phone;
					c.email = customer.email;
					c.address = customer.address;
				};
			});
		};
		$scope.editCustomerModal = function (name, phone, email, address, id) {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/customers/views/modal/editCustomerModal.client.view.html',
				controller: 'editCustomerController',
				resolve: {
					customer: function() {
						return {id: id, name: name, phone: phone, email: email, address: address}
					}
				}
			});
			editorInstance.result.then(function (customer) {
				deferred.resolve(customer);
			});
			return deferred.promise;
		};
		$scope.removeCustomer = function(id){
			$scope.removeCustomerModal(id).then(function(response){
				if (response === 'yes'){
					var c = _.find($scope.data.customers, function(c){
						return id === c._id;
					});
					$scope.data.customers = _.without($scope.data.customers, c);
				}
			});
		};
		$scope.removeCustomerModal = function (id) {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/customers/views/modal/removeCustomerModal.client.view.html',
				controller: 'removeCustomerController',
				resolve: {
					customer: function() {
						return {id: id}
					}
				}
			});
			editorInstance.result.then(function (response) {
				deferred.resolve(response);
			});
			return deferred.promise;
		};
		$scope.gridOptions.onRegisterApi = function (gridApi) {
			$scope.gridApi = gridApi;
		};
		$scope.initFTScrollerGrid = function(id) {
			setTimeout(function () {
				var containerElement = document.querySelector("#" + id + " .ui-grid-viewport");
				var scroller = new FTScroller(containerElement, {
					alwaysScroll: true,
					scrollingX: false
				});
			}, 100);
		};
	}
]);
