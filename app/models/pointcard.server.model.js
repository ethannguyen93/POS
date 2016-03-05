'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pointcard Schema
 */
var PointcardSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pointcard name',
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

mongoose.model('Pointcard', PointcardSchema);

var operationMap = {
	getAll: require('./operations/pointcard/getAll'),
	getPointcard: require('./operations/pointcard/getPointcard'),
	addPointcard: require('./operations/pointcard/addPointcard'),
	getSetting: require('./operations/pointcard/getSetting'),
	setSetting: require('./operations/pointcard/setSetting')

};
exports.operationMap = operationMap;
