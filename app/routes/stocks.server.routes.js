'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stocks = require('../../app/controllers/stocks.server.controller');
	var multiparty = require('connect-multiparty'),
		multipartyMiddleware = multiparty();

	// Stocks Routes
	app.route('/stocks')
		.get(stocks.list)
		.post(users.requiresLogin, stocks.create);

	app.route('/stocks/load')
		.post(stocks.load);

	app.route('/stocks/upload')
		.post(multipartyMiddleware, stocks.upload);

	// Finish by binding the Stock middleware
	app.param('stockId', stocks.stockByID);
};
