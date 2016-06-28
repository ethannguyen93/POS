'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || '127.0.0.1') + '/pos-dev',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/eeh-navigation/dist/eeh-navigation.css',
				'public/lib/angular-ui-grid/ui-grid.min.css',
				'public/lib/fullcalendar/dist/fullcalendar.css',
				'public/lib/components-font-awesome/css/font-awesome.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-cookies/angular-cookies.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-touch/angular-touch.min.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/underscore/underscore-min.js',
				'public/lib/eeh-navigation/dist/eeh-navigation.min.js',
				'public/lib/eeh-navigation/dist/eeh-navigation.tpl.min.js',
				'public/lib/angular-ui-grid/ui-grid.min.js',
				'public/lib/ftscroller/lib/ftscroller.js',
				'public/lib/dragscroll/dragscroll.js',
				'public/lib/pdfmake/build/pdfmake.min.js',
				'public/lib/pdfmake/build/vfs_fonts.js',
				'public/lib/ui-calendar/src/calendar.js',
				'public/lib/fullcalendar/dist/fullcalendar.js',
				'public/lib/ng-file-upload/FileAPI.min.js',
				'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
				'public/lib/ng-file-upload/ng-file-upload.min.js',
				'public/lib/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js',
				'public/lib/dymo/DYMO.Label.Framework.2.0.2.js',
				'public/lib/webcam/app/scripts/webcam.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
