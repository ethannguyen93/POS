'use strict';


angular.module('core').controller('HomeController', [
	'$scope', '$state', 'Authentication', 'UserService', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
	'LoginpageService', '$timeout', '$q', 'Modals', 'hidScanner', 'POSData', 'Config',
	function(
		$scope, $state, Authentication, UserService, RetrieveEmployee, RetrieveInventory, MainpageServices,
		LoginpageService, $timeout, $q, Modals, hidScanner, POSData, Config
	) {
		activate();
		// Inject UserService into $scope
		$scope.UserService = UserService;

		$scope.config = Config;

		// Function to check if in specified State, used to render menu items
		$scope.inState = function (state) {
			return $state.current.name.indexOf(state) >= 0;
		};

		/*User Login Page*/
		$scope.numpad = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
		$scope.updatePasscode = LoginpageService.updatePasscode;
		$scope.remove = LoginpageService.remove;

		$scope.verify = function() {
			LoginpageService.verify().then(function() {
				// Successfully logged in
				$state.go('^.authenticated');
			}, function() {
				// Failed
				$scope.failedAttempt = true;
				$timeout(function() {
					$scope.failedAttempt = false;
				}, 150);
			})
		};

		// Header Logout
		$scope.userLogout = function(){
			Modals.openLogoutModal().then(function(response){
				if (response === 'yes'){
					$scope.logOut();
				}
			});
		};

		$scope.logOut = function() {
			hidScanner.destroy();
			POSData.init();
			UserService.logoutUser();
			$state.go('core.login');
		};

		function activate() {
			$scope.passcode = LoginpageService.init();
		}

	}

]);
