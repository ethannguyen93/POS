'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Email Schema
 */
var EmailSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Email name',
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

mongoose.model('Email', EmailSchema);