'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Inventory Schema
 */
var InventorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Inventory name',
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

mongoose.model('Inventory', InventorySchema);

var operationMap = {
	retrieveCat: require('./operations/inventory/retrieveCat'),
	retrieveItem: require('./operations/inventory/retrieveItem'),
	getIndex: require('./operations/inventory/getIndex'),
	getAll: require('./operations/inventory/getAll'),
	remove: require('./operations/inventory/remove'),
	add: require('./operations/inventory/add'),
	rename: require('./operations/inventory/renameCategory'),
	updateItem: require('./operations/inventory/updateItem'),
	saveOrder: require('./operations/inventory/saveOrder'),
	getOrder: require('./operations/inventory/getOrder'),
	selectOneOrder: require('./operations/inventory/selectOneOrder')
};

exports.operationMap = operationMap;
