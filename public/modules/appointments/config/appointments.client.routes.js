'use strict';

//Setting up route
angular.module('appointments').config(['$stateProvider',
	function($stateProvider) {
		// Appointments state routing
		$stateProvider.
		state('listAppointments', {
			url: '/appointments',
			templateUrl: 'modules/appointments/views/list-appointments.client.view.html'
		}).
		state('createAppointment', {
			url: '/appointments/create',
			templateUrl: 'modules/appointments/views/create-appointment.client.view.html'
		}).
		state('viewAppointment', {
			url: '/appointments/:appointmentId',
			templateUrl: 'modules/appointments/views/view-appointment.client.view.html'
		}).
		state('editAppointment', {
			url: '/appointments/:appointmentId/edit',
			templateUrl: 'modules/appointments/views/edit-appointment.client.view.html'
		});
	}
]);