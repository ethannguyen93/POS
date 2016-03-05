'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pointcards = require('../../app/controllers/pointcards.server.controller');

	// Pointcards Routes
	app.route('/pointcards')
		.get(pointcards.list)
		.post(users.requiresLogin, pointcards.create);

	app.route('/pointcards/:pointcardId')
		.get(pointcards.read)
		.put(users.requiresLogin, pointcards.hasAuthorization, pointcards.update)
		.delete(users.requiresLogin, pointcards.hasAuthorization, pointcards.delete);

	app.route('/pointcards/load')
		.post(pointcards.load);

	// Finish by binding the Pointcard middleware
	app.param('pointcardId', pointcards.pointcardByID);
};
