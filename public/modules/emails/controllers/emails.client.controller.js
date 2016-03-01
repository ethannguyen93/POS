'use strict';

// Emails controller
angular.module('emails').controller('EmailsController', ['$scope', '$timeout', '$q', '$stateParams', '$location', 'Authentication', 'Emails', '$modal',
	function($scope, $timeout, $q, $stateParams, $location, Authentication, Emails, $modal) {
		$scope.authentication = Authentication;

		$scope.notification = "";

		// Create new Email
		$scope.create = function() {
			// Create new Email object
			var email = new Emails ({
				name: this.name
			});

			// Redirect after save
			email.$save(function(response) {
				$location.path('emails/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.removeById = function(id) {
			$scope.email = Emails.get({
				emailId: id
			});

			$scope.email.$promise.then(function() {
				$scope.email.$remove(function() {
					$scope.find();
				});
			})
		};

		$scope.sendEmail = function(id) {
			$scope.email = Emails.get({
				emailId: id
			});

			$scope.email.$promise.then(function() {
				$scope.email.$send(function() {
					$scope.notification = 'Successfully sent email!';
					$timeout(function() {
						$scope.notification = "";
					}, 5000);
				});
			})
		};

		// Remove existing Email
		$scope.remove = function(email) {
			if ( email ) { 
				email.$remove();

				for (var i in $scope.emails) {
					if ($scope.emails [i] === email) {
						$scope.emails.splice(i, 1);
					}
				}
			} else {
				$scope.email.$remove(function() {
					$location.path('emails');
				});
			}
		};

		var defaultEmail = {
			"config": {
				"footer": "Some text",
				"blocks": [
					{
						"btnLink": "",
						"btnText": "View now!",
						"btnEnabled": true,
						"content": "The quick brown fox jumps over the lazy dog",
						"tag": "$29.99",
						"heading": "Pink Shoes",
						"imgUrl": "http://s3.amazonaws.com/swu-filepicker/9wRy50HQTg2CTyZA5Ozi_item_images_16.jpg",
						"imgEnabled": true
					}
				],
				"subHeading": "Look out for awesome deals!",
				"mainBtnLink": "http://google.ca",
				"mainBtnText": "View now!",
				"mainBtnEnabled": true,
				"mainParagraph": "Today only flash sale!",
				"mainImg": "http://s3.amazonaws.com/swu-filepicker/9wRy50HQTg2CTyZA5Ozi_item_images_16.jpg",
				"mainHeading": "Save up to 20%",
				"storeName": "Gold Shop",
				"subject": "New Sales!"
			}
		};

		$scope.createNew = function() {
			var newEmail = Object.create(defaultEmail);
			openModal(newEmail).then(function(config) {
				// Create new Email object
				var email = new Emails ({
					name: config.subject,
					config: config
				});

				// Redirect after save
				email.$save(function(response) {
					$scope.emails.unshift(email);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			});
		};

		$scope.editEmailModal = function(id){
			$scope.email = Emails.get({
				emailId: id
			});

			$scope.email.$promise.then(function() {
				openModal($scope.email).then(function(config) {
					$scope.email.config = config;
					$scope.name = config.subject;

					$scope.email.$update(function() {
						console.log('Updated successfully!');
						$scope.find();
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				})
			})
		};

		var openModal = function(emailParam) {
			var deferred = $q.defer();
			var editorInstance = $modal.open({
				animation: true,
				windowClass: 'modal-fullwindow modal-email',
				templateUrl: 'modules/admin/views/subviews/modals/email.modal.admin.client.view.html',
				controller: 'EmailModalController',
				backdrop : 'static',
				resolve: {
					email : function(){
						return emailParam;
					}
				}
			});
			editorInstance.result.then(function (email) {
				console.log(email);
				deferred.resolve(email);
			});
			return deferred.promise;
		};


		// Update existing Email
		$scope.update = function() {
			var email = $scope.email;

			email.$update(function() {
				$location.path('emails/' + email._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Emails
		$scope.find = function() {
			$scope.emails = Emails.query();
		};

		// Find existing Email
		$scope.findOne = function() {
			$scope.email = Emails.get({ 
				emailId: $stateParams.emailId
			});
		};

		$scope.yo = function() {
			console.log("yo");
		};


	}
]);
