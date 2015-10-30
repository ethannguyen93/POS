'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var giftcards = require('../../app/controllers/giftcards.server.controller');

	// Giftcards Routes
	app.route('/giftcards')
		.get(giftcards.list)
		.post(users.requiresLogin, giftcards.create);

	app.route('/giftcards/:giftcardId')
		.get(giftcards.read)
		.put(users.requiresLogin, giftcards.hasAuthorization, giftcards.update)
		.delete(users.requiresLogin, giftcards.hasAuthorization, giftcards.delete);

	app.route('/giftcards/load')
		.post(giftcards.load);

	// Finish by binding the Giftcard middleware
	app.param('giftcardId', giftcards.giftcardByID);
};
