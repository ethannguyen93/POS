'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Stock = mongoose.model('Stock'),
	_ = require('lodash'),
	stockModel = require('../models/stock.server.model'),
	multer = require('multer');

/**
 * Create a Stock
 */
exports.create = function(req, res) {
	var stock = new Stock(req.body);
	stock.user = req.user;

	stock.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stock);
		}
	});
};

/**
 * Show the current Stock
 */
exports.read = function(req, res) {
	res.jsonp(req.stock);
};

/**
 * Update a Stock
 */
exports.update = function(req, res) {
	var stock = req.stock ;

	stock = _.extend(stock , req.body);

	stock.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stock);
		}
	});
};

/**
 * Delete an Stock
 */
exports.delete = function(req, res) {
	var stock = req.stock ;

	stock.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stock);
		}
	});
};

/**
 * List of Stocks
 */
exports.list = function(req, res) { 
	Stock.find().sort('-created').populate('user', 'displayName').exec(function(err, stocks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stocks);
		}
	});
};

/**
 * Stock middleware
 */
exports.stockByID = function(req, res, next, id) { 
	Stock.findById(id).populate('user', 'displayName').exec(function(err, stock) {
		if (err) return next(err);
		if (! stock) return next(new Error('Failed to load Stock ' + id));
		req.stock = stock ;
		next();
	});
};

/**
 * Stock authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stock.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.load = function(req, res) {
	stockModel.operationMap[req.body.type](req, res);
};

exports.upload = function(req, res) {
	var fs = require('fs');
	var file = req.files.file;
	var contentType = file.headers['content-type'];
	var tmpPath = file.path;
	var extIndex = tmpPath.lastIndexOf('.');
	var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
	// uuid is for generating unique filenames.
	var fileName = 'stock_' + req.body._id + extension;
	var destPath = './public/upload/' + fileName;
	// Server side file type checker.
	if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
		fs.unlink(tmpPath);
		return res.status(400).send('Unsupported file type.');
	}

	fs.rename(tmpPath, destPath, function(err) {
		if (err) {
			return res.status(400).send('Image is not saved:');
		}
		var connectionDB = mongoose.connection.db;
		connectionDB.collection('items', function (err, collection) {
			collection.update({
				_id: mongoose.Types.ObjectId(req.body._id)
			},{
				$set: {
					image: fileName
				}
			}, function(err, result){
				if (err) {
					console.log(err)
				} else {
					return res.json(fileName)
				}
			})
		});
	});
};
