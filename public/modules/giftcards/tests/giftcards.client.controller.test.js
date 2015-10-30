'use strict';

(function() {
	// Giftcards Controller Spec
	describe('Giftcards Controller Tests', function() {
		// Initialize global variables
		var GiftcardsController,
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

			// Initialize the Giftcards controller.
			GiftcardsController = $controller('GiftcardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Giftcard object fetched from XHR', inject(function(Giftcards) {
			// Create sample Giftcard using the Giftcards service
			var sampleGiftcard = new Giftcards({
				name: 'New Giftcard'
			});

			// Create a sample Giftcards array that includes the new Giftcard
			var sampleGiftcards = [sampleGiftcard];

			// Set GET response
			$httpBackend.expectGET('giftcards').respond(sampleGiftcards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.giftcards).toEqualData(sampleGiftcards);
		}));

		it('$scope.findOne() should create an array with one Giftcard object fetched from XHR using a giftcardId URL parameter', inject(function(Giftcards) {
			// Define a sample Giftcard object
			var sampleGiftcard = new Giftcards({
				name: 'New Giftcard'
			});

			// Set the URL parameter
			$stateParams.giftcardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/giftcards\/([0-9a-fA-F]{24})$/).respond(sampleGiftcard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.giftcard).toEqualData(sampleGiftcard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Giftcards) {
			// Create a sample Giftcard object
			var sampleGiftcardPostData = new Giftcards({
				name: 'New Giftcard'
			});

			// Create a sample Giftcard response
			var sampleGiftcardResponse = new Giftcards({
				_id: '525cf20451979dea2c000001',
				name: 'New Giftcard'
			});

			// Fixture mock form input values
			scope.name = 'New Giftcard';

			// Set POST response
			$httpBackend.expectPOST('giftcards', sampleGiftcardPostData).respond(sampleGiftcardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Giftcard was created
			expect($location.path()).toBe('/giftcards/' + sampleGiftcardResponse._id);
		}));

		it('$scope.update() should update a valid Giftcard', inject(function(Giftcards) {
			// Define a sample Giftcard put data
			var sampleGiftcardPutData = new Giftcards({
				_id: '525cf20451979dea2c000001',
				name: 'New Giftcard'
			});

			// Mock Giftcard in scope
			scope.giftcard = sampleGiftcardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/giftcards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/giftcards/' + sampleGiftcardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid giftcardId and remove the Giftcard from the scope', inject(function(Giftcards) {
			// Create new Giftcard object
			var sampleGiftcard = new Giftcards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Giftcards array and include the Giftcard
			scope.giftcards = [sampleGiftcard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/giftcards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGiftcard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.giftcards.length).toBe(0);
		}));
	});
}());