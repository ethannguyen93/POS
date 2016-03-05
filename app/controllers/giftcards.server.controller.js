'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Giftcard = mongoose.model('Giftcard'),
	_ = require('lodash'),
	giftcardModel = require('../models/giftcard.server.model');

/**
 * Create a Giftcard
 */
exports.create = function(req, res) {
	var giftcard = new Giftcard(req.body);
	giftcard.user = req.user;

	giftcard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(giftcard);
		}
	});
};

/**
 * Show the current Giftcard
 */
exports.read = function(req, res) {
	res.jsonp(req.giftcard);
};

/**
 * Update a Giftcard
 */
exports.update = function(req, res) {
	var giftcard = req.giftcard ;

	giftcard = _.extend(giftcard , req.body);

	giftcard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(giftcard);
		}
	});
};

/**
 * Delete an Giftcard
 */
exports.delete = function(req, res) {
	var giftcard = req.giftcard ;

	giftcard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(giftcard);
		}
	});
};

/**
 * List of Giftcards
 */
exports.list = function(req, res) { 
	Giftcard.find().sort('-created').populate('user', 'displayName').exec(function(err, giftcards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(giftcards);
		}
	});
};

/**
 * Giftcard middleware
 */
exports.giftcardByID = function(req, res, next, id) { 
	Giftcard.findById(id).populate('user', 'displayName').exec(function(err, giftcard) {
		if (err) return next(err);
		if (! giftcard) return next(new Error('Failed to load Giftcard ' + id));
		req.giftcard = giftcard ;
		next();
	});
};

/**
 * Giftcard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.giftcard.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.load = function(req, res){
	console.log(req.body);
	giftcardModel.operationMap[req.body.type](req, res);
};
