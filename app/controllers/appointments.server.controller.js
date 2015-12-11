'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Appointment = mongoose.model('Appointment'),
	_ = require('lodash'),
	appointmentModel = require('../models/appointment.server.model');

/**
 * Create a Appointment
 */
exports.create = function(req, res) {
	var appointment = new Appointment(req.body);
	appointment.user = req.user;

	appointment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(appointment);
		}
	});
};

/**
 * Show the current Appointment
 */
exports.read = function(req, res) {
	res.jsonp(req.appointment);
};

/**
 * Update a Appointment
 */
exports.update = function(req, res) {
	var appointment = req.appointment ;

	appointment = _.extend(appointment , req.body);

	appointment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(appointment);
		}
	});
};

/**
 * Delete an Appointment
 */
exports.delete = function(req, res) {
	var appointment = req.appointment ;

	appointment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(appointment);
		}
	});
};

/**
 * List of Appointments
 */
exports.list = function(req, res) { 
	Appointment.find().sort('-created').populate('user', 'displayName').exec(function(err, appointments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(appointments);
		}
	});
};

/**
 * Appointment middleware
 */
exports.appointmentByID = function(req, res, next, id) { 
	Appointment.findById(id).populate('user', 'displayName').exec(function(err, appointment) {
		if (err) return next(err);
		if (! appointment) return next(new Error('Failed to load Appointment ' + id));
		req.appointment = appointment ;
		next();
	});
};

/**
 * Appointment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.appointment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.load = function(req, res){
	console.log(req.body);
	appointmentModel.operationMap[req.body.type](req, res);
};
