'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Giftcard Schema
 */
var GiftcardSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Giftcard name',
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

mongoose.model('Giftcard', GiftcardSchema);

var operationMap = {
	getAll: require('./operations/giftcard/getAll'),
	getGiftcard: require('./operations/giftcard/getGiftcard')
};
exports.operationMap = operationMap;
