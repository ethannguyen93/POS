'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Stock Schema
 */
var StockSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Stock name',
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

mongoose.model('Stock', StockSchema);

var operationMap = {
	getAllItem: require('./operations/stock/getAllItem'),
	getAllCategory: require('./operations/stock/getAllCategory'),
	addItem: require('./operations/stock/addItem'),
	removeItem: require('./operations/stock/removeItem'),
	editQuantity: require('./operations/stock/editQuantity'),
	printBarcode: require('./operations/stock/printBarcode'),
	getItemWithBarcode: require('./operations/stock/getItemWithBarcode')
};

exports.operationMap = operationMap;
