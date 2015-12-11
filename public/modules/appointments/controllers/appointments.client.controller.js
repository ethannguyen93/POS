'use strict';

// Appointments controller
angular.module('appointments').controller('AppointmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Appointments',
	function($scope, $stateParams, $location, Authentication, Appointments) {
		$scope.authentication = Authentication;

		// Create new Appointment
		$scope.create = function() {
			// Create new Appointment object
			var appointment = new Appointments ({
				name: this.name
			});

			// Redirect after save
			appointment.$save(function(response) {
				$location.path('appointments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Appointment
		$scope.remove = function(appointment) {
			if ( appointment ) { 
				appointment.$remove();

				for (var i in $scope.appointments) {
					if ($scope.appointments [i] === appointment) {
						$scope.appointments.splice(i, 1);
					}
				}
			} else {
				$scope.appointment.$remove(function() {
					$location.path('appointments');
				});
			}
		};

		// Update existing Appointment
		$scope.update = function() {
			var appointment = $scope.appointment;

			appointment.$update(function() {
				$location.path('appointments/' + appointment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Appointments
		$scope.find = function() {
			$scope.appointments = Appointments.query();
		};

		// Find existing Appointment
		$scope.findOne = function() {
			$scope.appointment = Appointments.get({ 
				appointmentId: $stateParams.appointmentId
			});
		};
	}
]);