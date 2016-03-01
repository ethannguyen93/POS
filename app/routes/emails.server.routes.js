'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var customers = require('../../app/controllers/customers.server.controller');
    var emails = require('../../app/controllers/emails.server.controller');

    // Emails Routes
    app.route('/emails')
        .get(emails.list)
        //.post(users.requiresLogin, emails.create);
        .post(emails.create);

    app.route('/emails/test')
        .get(emails.sendTest);

    app.route('/emails/:emailId')
        .get(emails.read)
        .put(emails.update)
        .post(customers.listNin, emails.sendEmail)
        .delete(emails.delete);

    app.route('/emails/:emailId/send')
        // TODO change to post
        .post(customers.listNin, emails.sendEmail);

    // Finish by binding the Email middleware
    app.param('emailId', emails.emailByID);
};
