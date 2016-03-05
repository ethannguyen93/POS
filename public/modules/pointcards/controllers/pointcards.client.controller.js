'use strict';

// Pointcards controller
angular.module('pointcards').controller('PointcardsController', ['$scope', '$stateParams', '$location', 'Pointcards',
	'hidScanner', '$rootScope', 'RetrievePointcard', '$modal', '$q',
	function($scope, $stateParams, $location, Pointcards, hidScanner, $rootScope, RetrievePointcard,
			 $modal, $q) {
		$scope.data = {
			newpc: '',
			errorMessage: '',
			isError: false,
			pointcards: []
		};
		$scope.gridOptions = {
			rowHeight: 60,
			columnFooterHeight: 60,
			showColumnFooter: true,
			enableFiltering: true,
			enablePaginationControls: false,
			paginationPageSize: 10,
			data: 'data.pointcards'
		};
		$scope.initPointcard = function(){
			$scope.gridOptions.columnDefs = [
				{
					name: 'Number',
					field: 'number',
					footerCellTemplate: '<input ng-model="grid.appScope.data.newpc" ' +
					'ng-change="grid.appScope.reset()" placeholder="New Point Card number"/>'
				},
				{
					name: 'Points',
					enableFiltering: false,
					field: 'point',
					footerCellTemplate: '<a href="" ng-click="grid.appScope.addPointcard()"> <span class="glyphicon glyphicon-plus"></span> </a>'
				}
			];
			var body = {
				type: 'getAll'
			};
			RetrievePointcard.load(body, function(response){
				$scope.data.pointcards= response;
			})
		};
		$scope.reset = function(){
			$scope.data.errorMessage = '';
			$scope.data.isError = false;
		};
		hidScanner.initialize($scope);
		$scope.$on("hidScanner::scanned", function(event, args) {
			$scope.data.newpc = args.barcode;
			$scope.addPointcard();
		});
		$scope.$on('$destroy', function(){
			hidScanner.destroy();
		});
		$scope.addPointcard = function(){
			var pointcardNumber = $scope.data.newpc;
			var pointcard = _.find($scope.data.pointcards, function(pc){
				return pc.number === pointcardNumber;
			});
			if (pointcard === undefined){
				$scope.addPointcardModal(pointcardNumber).then(function(pointcard){
					if (pointcard !== 'no'){
						$scope.data.pointcards.push(pointcard);
					}
				});
			}else{
				$scope.data.errorMessage = 'This Point Card is already existed!';
				$scope.data.isError = true;
			}
		};
		$scope.addPointcardModal = function (pointcardNumber) {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow',
				templateUrl: 'modules/pointcards/views/modal/addPointcardModal.client.view.html',
				controller: 'addPointcardController',
				resolve: {
					pointcardNumber: function() {
						return pointcardNumber
					}
				}
			});
			editorInstance.result.then(function (pointcard) {
				deferred.resolve(pointcard);
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
