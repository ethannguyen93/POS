'use strict';

(function() {
	// Pointcards Controller Spec
	describe('Pointcards Controller Tests', function() {
		// Initialize global variables
		var PointcardsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Pointcards controller.
			PointcardsController = $controller('PointcardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pointcard object fetched from XHR', inject(function(Pointcards) {
			// Create sample Pointcard using the Pointcards service
			var samplePointcard = new Pointcards({
				name: 'New Pointcard'
			});

			// Create a sample Pointcards array that includes the new Pointcard
			var samplePointcards = [samplePointcard];

			// Set GET response
			$httpBackend.expectGET('pointcards').respond(samplePointcards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pointcards).toEqualData(samplePointcards);
		}));

		it('$scope.findOne() should create an array with one Pointcard object fetched from XHR using a pointcardId URL parameter', inject(function(Pointcards) {
			// Define a sample Pointcard object
			var samplePointcard = new Pointcards({
				name: 'New Pointcard'
			});

			// Set the URL parameter
			$stateParams.pointcardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pointcards\/([0-9a-fA-F]{24})$/).respond(samplePointcard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pointcard).toEqualData(samplePointcard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pointcards) {
			// Create a sample Pointcard object
			var samplePointcardPostData = new Pointcards({
				name: 'New Pointcard'
			});

			// Create a sample Pointcard response
			var samplePointcardResponse = new Pointcards({
				_id: '525cf20451979dea2c000001',
				name: 'New Pointcard'
			});

			// Fixture mock form input values
			scope.name = 'New Pointcard';

			// Set POST response
			$httpBackend.expectPOST('pointcards', samplePointcardPostData).respond(samplePointcardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pointcard was created
			expect($location.path()).toBe('/pointcards/' + samplePointcardResponse._id);
		}));

		it('$scope.update() should update a valid Pointcard', inject(function(Pointcards) {
			// Define a sample Pointcard put data
			var samplePointcardPutData = new Pointcards({
				_id: '525cf20451979dea2c000001',
				name: 'New Pointcard'
			});

			// Mock Pointcard in scope
			scope.pointcard = samplePointcardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pointcards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pointcards/' + samplePointcardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pointcardId and remove the Pointcard from the scope', inject(function(Pointcards) {
			// Create new Pointcard object
			var samplePointcard = new Pointcards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pointcards array and include the Pointcard
			scope.pointcards = [samplePointcard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pointcards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePointcard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pointcards.length).toBe(0);
		}));
	});
}());