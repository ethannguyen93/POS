'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pointcard = mongoose.model('Pointcard'),
	_ = require('lodash'),
	pointcardModel = require('../models/pointcard.server.model');

/**
 * Create a Pointcard
 */
exports.create = function(req, res) {
	var pointcard = new Pointcard(req.body);
	pointcard.user = req.user;

	pointcard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pointcard);
		}
	});
};

/**
 * Show the current Pointcard
 */
exports.read = function(req, res) {
	res.jsonp(req.pointcard);
};

/**
 * Update a Pointcard
 */
exports.update = function(req, res) {
	var pointcard = req.pointcard ;

	pointcard = _.extend(pointcard , req.body);

	pointcard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pointcard);
		}
	});
};

/**
 * Delete an Pointcard
 */
exports.delete = function(req, res) {
	var pointcard = req.pointcard ;

	pointcard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pointcard);
		}
	});
};

/**
 * List of Pointcards
 */
exports.list = function(req, res) { 
	Pointcard.find().sort('-created').populate('user', 'displayName').exec(function(err, pointcards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pointcards);
		}
	});
};

/**
 * Pointcard middleware
 */
exports.pointcardByID = function(req, res, next, id) { 
	Pointcard.findById(id).populate('user', 'displayName').exec(function(err, pointcard) {
		if (err) return next(err);
		if (! pointcard) return next(new Error('Failed to load Pointcard ' + id));
		req.pointcard = pointcard ;
		next();
	});
};

/**
 * Pointcard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pointcard.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.load = function(req, res){
	console.log(req.body);
	pointcardModel.operationMap[req.body.type](req, res);
};
