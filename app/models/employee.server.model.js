'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Employee Schema
 */
var EmployeeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Employee name',
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

mongoose.model('Employee', EmployeeSchema);

var operationMap = {
	getEmployee: require('./operations/employees/getEmployee'),
	getAll: require('./operations/employees/getAllEmployees'),
	add: require('./operations/employees/addEmployee'),
	remove: require('./operations/employees/removeEmployee'),
	validateAdmin: require('./operations/employees/validateAdmin'),
	updateAdminPassword: require('./operations/employees/updateAdminPassword'),
	rename: require('./operations/employees/renameEmployee'),
	updateEmployeePassword: require('./operations/employees/updateEmployeePassword')
};
exports.operationMap = operationMap;
