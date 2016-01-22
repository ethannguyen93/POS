'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Appointment Schema
 */
var AppointmentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Appointment name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Appointment', AppointmentSchema);

var operationMap = {
	getAll: require('./operations/appointment/getAllAppointments'),
	getAllGivenDate: require('./operations/appointment/getAllAppointmentsGivenWeek'),
	add: require('./operations/appointment/addAppointment'),
	update: require('./operations/appointment/updateAppointment'),
	delete: require('./operations/appointment/removeAppointment'),
	sendReminders: require('./operations/appointment/sendReminders')
};
exports.operationMap = operationMap;
