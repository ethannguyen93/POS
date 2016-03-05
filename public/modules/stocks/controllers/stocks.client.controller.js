'use strict';

// Stocks controller
angular.module('stocks').controller('StocksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stocks',
	function($scope, $stateParams, $location, Authentication, Stocks) {
		$scope.authentication = Authentication;

		// Create new Stock
		$scope.create = function() {
			// Create new Stock object
			var stock = new Stocks ({
				name: this.name
			});

			// Redirect after save
			stock.$save(function(response) {
				$location.path('stocks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Stock
		$scope.remove = function(stock) {
			if ( stock ) { 
				stock.$remove();

				for (var i in $scope.stocks) {
					if ($scope.stocks [i] === stock) {
						$scope.stocks.splice(i, 1);
					}
				}
			} else {
				$scope.stock.$remove(function() {
					$location.path('stocks');
				});
			}
		};

		// Update existing Stock
		$scope.update = function() {
			var stock = $scope.stock;

			stock.$update(function() {
				$location.path('stocks/' + stock._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stocks
		$scope.find = function() {
			$scope.stocks = Stocks.query();
		};

		// Find existing Stock
		$scope.findOne = function() {
			$scope.stock = Stocks.get({ 
				stockId: $stateParams.stockId
			});
		};
	}
]);