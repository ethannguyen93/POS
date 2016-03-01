'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Customer name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	email: {
		type: String,
		default: ''
	}
});

mongoose.model('Customer', CustomerSchema);


var operationMap = {
	getCustomer: require('./operations/customers/getCustomer'),
	addCustomer: require('./operations/customers/addCustomer'),
	getAll: require('./operations/customers/getAllCustomers'),
	update: require('./operations/customers/updateCustomer'),
	remove: require('./operations/customers/removeCustomer')
};
exports.operationMap = operationMap;
