'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Appointment = mongoose.model('Appointment'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, appointment;

/**
 * Appointment routes tests
 */
describe('Appointment CRUD tests', function() {
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

		// Save a user to the test db and create new Appointment
		user.save(function() {
			appointment = {
				name: 'Appointment Name'
			};

			done();
		});
	});

	it('should be able to save Appointment instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Appointment
				agent.post('/appointments')
					.send(appointment)
					.expect(200)
					.end(function(appointmentSaveErr, appointmentSaveRes) {
						// Handle Appointment save error
						if (appointmentSaveErr) done(appointmentSaveErr);

						// Get a list of Appointments
						agent.get('/appointments')
							.end(function(appointmentsGetErr, appointmentsGetRes) {
								// Handle Appointment save error
								if (appointmentsGetErr) done(appointmentsGetErr);

								// Get Appointments list
								var appointments = appointmentsGetRes.body;

								// Set assertions
								(appointments[0].user._id).should.equal(userId);
								(appointments[0].name).should.match('Appointment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Appointment instance if not logged in', function(done) {
		agent.post('/appointments')
			.send(appointment)
			.expect(401)
			.end(function(appointmentSaveErr, appointmentSaveRes) {
				// Call the assertion callback
				done(appointmentSaveErr);
			});
	});

	it('should not be able to save Appointment instance if no name is provided', function(done) {
		// Invalidate name field
		appointment.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Appointment
				agent.post('/appointments')
					.send(appointment)
					.expect(400)
					.end(function(appointmentSaveErr, appointmentSaveRes) {
						// Set message assertion
						(appointmentSaveRes.body.message).should.match('Please fill Appointment name');
						
						// Handle Appointment save error
						done(appointmentSaveErr);
					});
			});
	});

	it('should be able to update Appointment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Appointment
				agent.post('/appointments')
					.send(appointment)
					.expect(200)
					.end(function(appointmentSaveErr, appointmentSaveRes) {
						// Handle Appointment save error
						if (appointmentSaveErr) done(appointmentSaveErr);

						// Update Appointment name
						appointment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Appointment
						agent.put('/appointments/' + appointmentSaveRes.body._id)
							.send(appointment)
							.expect(200)
							.end(function(appointmentUpdateErr, appointmentUpdateRes) {
								// Handle Appointment update error
								if (appointmentUpdateErr) done(appointmentUpdateErr);

								// Set assertions
								(appointmentUpdateRes.body._id).should.equal(appointmentSaveRes.body._id);
								(appointmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Appointments if not signed in', function(done) {
		// Create new Appointment model instance
		var appointmentObj = new Appointment(appointment);

		// Save the Appointment
		appointmentObj.save(function() {
			// Request Appointments
			request(app).get('/appointments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Appointment if not signed in', function(done) {
		// Create new Appointment model instance
		var appointmentObj = new Appointment(appointment);

		// Save the Appointment
		appointmentObj.save(function() {
			request(app).get('/appointments/' + appointmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', appointment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Appointment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Appointment
				agent.post('/appointments')
					.send(appointment)
					.expect(200)
					.end(function(appointmentSaveErr, appointmentSaveRes) {
						// Handle Appointment save error
						if (appointmentSaveErr) done(appointmentSaveErr);

						// Delete existing Appointment
						agent.delete('/appointments/' + appointmentSaveRes.body._id)
							.send(appointment)
							.expect(200)
							.end(function(appointmentDeleteErr, appointmentDeleteRes) {
								// Handle Appointment error error
								if (appointmentDeleteErr) done(appointmentDeleteErr);

								// Set assertions
								(appointmentDeleteRes.body._id).should.equal(appointmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Appointment instance if not signed in', function(done) {
		// Set Appointment user 
		appointment.user = user;

		// Create new Appointment model instance
		var appointmentObj = new Appointment(appointment);

		// Save the Appointment
		appointmentObj.save(function() {
			// Try deleting Appointment
			request(app).delete('/appointments/' + appointmentObj._id)
			.expect(401)
			.end(function(appointmentDeleteErr, appointmentDeleteRes) {
				// Set message assertion
				(appointmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Appointment error error
				done(appointmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Appointment.remove().exec();
		done();
	});
});