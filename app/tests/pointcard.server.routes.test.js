'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pointcard = mongoose.model('Pointcard'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pointcard;

/**
 * Pointcard routes tests
 */
describe('Pointcard CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Pointcard
		user.save(function() {
			pointcard = {
				name: 'Pointcard Name'
			};

			done();
		});
	});

	it('should be able to save Pointcard instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pointcard
				agent.post('/pointcards')
					.send(pointcard)
					.expect(200)
					.end(function(pointcardSaveErr, pointcardSaveRes) {
						// Handle Pointcard save error
						if (pointcardSaveErr) done(pointcardSaveErr);

						// Get a list of Pointcards
						agent.get('/pointcards')
							.end(function(pointcardsGetErr, pointcardsGetRes) {
								// Handle Pointcard save error
								if (pointcardsGetErr) done(pointcardsGetErr);

								// Get Pointcards list
								var pointcards = pointcardsGetRes.body;

								// Set assertions
								(pointcards[0].user._id).should.equal(userId);
								(pointcards[0].name).should.match('Pointcard Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pointcard instance if not logged in', function(done) {
		agent.post('/pointcards')
			.send(pointcard)
			.expect(401)
			.end(function(pointcardSaveErr, pointcardSaveRes) {
				// Call the assertion callback
				done(pointcardSaveErr);
			});
	});

	it('should not be able to save Pointcard instance if no name is provided', function(done) {
		// Invalidate name field
		pointcard.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pointcard
				agent.post('/pointcards')
					.send(pointcard)
					.expect(400)
					.end(function(pointcardSaveErr, pointcardSaveRes) {
						// Set message assertion
						(pointcardSaveRes.body.message).should.match('Please fill Pointcard name');
						
						// Handle Pointcard save error
						done(pointcardSaveErr);
					});
			});
	});

	it('should be able to update Pointcard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pointcard
				agent.post('/pointcards')
					.send(pointcard)
					.expect(200)
					.end(function(pointcardSaveErr, pointcardSaveRes) {
						// Handle Pointcard save error
						if (pointcardSaveErr) done(pointcardSaveErr);

						// Update Pointcard name
						pointcard.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pointcard
						agent.put('/pointcards/' + pointcardSaveRes.body._id)
							.send(pointcard)
							.expect(200)
							.end(function(pointcardUpdateErr, pointcardUpdateRes) {
								// Handle Pointcard update error
								if (pointcardUpdateErr) done(pointcardUpdateErr);

								// Set assertions
								(pointcardUpdateRes.body._id).should.equal(pointcardSaveRes.body._id);
								(pointcardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pointcards if not signed in', function(done) {
		// Create new Pointcard model instance
		var pointcardObj = new Pointcard(pointcard);

		// Save the Pointcard
		pointcardObj.save(function() {
			// Request Pointcards
			request(app).get('/pointcards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pointcard if not signed in', function(done) {
		// Create new Pointcard model instance
		var pointcardObj = new Pointcard(pointcard);

		// Save the Pointcard
		pointcardObj.save(function() {
			request(app).get('/pointcards/' + pointcardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pointcard.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pointcard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pointcard
				agent.post('/pointcards')
					.send(pointcard)
					.expect(200)
					.end(function(pointcardSaveErr, pointcardSaveRes) {
						// Handle Pointcard save error
						if (pointcardSaveErr) done(pointcardSaveErr);

						// Delete existing Pointcard
						agent.delete('/pointcards/' + pointcardSaveRes.body._id)
							.send(pointcard)
							.expect(200)
							.end(function(pointcardDeleteErr, pointcardDeleteRes) {
								// Handle Pointcard error error
								if (pointcardDeleteErr) done(pointcardDeleteErr);

								// Set assertions
								(pointcardDeleteRes.body._id).should.equal(pointcardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pointcard instance if not signed in', function(done) {
		// Set Pointcard user 
		pointcard.user = user;

		// Create new Pointcard model instance
		var pointcardObj = new Pointcard(pointcard);

		// Save the Pointcard
		pointcardObj.save(function() {
			// Try deleting Pointcard
			request(app).delete('/pointcards/' + pointcardObj._id)
			.expect(401)
			.end(function(pointcardDeleteErr, pointcardDeleteRes) {
				// Set message assertion
				(pointcardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pointcard error error
				done(pointcardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pointcard.remove().exec();
		done();
	});
});