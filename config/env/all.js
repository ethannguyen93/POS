'use strict';

module.exports = {
	app: {
		title: 'POS',
		description: 'POS System',
		keywords: 'Fast, Secured, Easy-to-use'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/eeh-navigation/dist/eeh-navigation.css',
				'public/lib/angular-ui-grid/ui-grid.min.css',
				'public/lib/fullcalendar/dist/fullcalendar.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-animate/another_animate.js',
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/underscore/underscore-min.js',
				'public/lib/eeh-navigation/dist/eeh-navigation.js',
				'public/lib/eeh-navigation/dist/eeh-navigation.tpl.js',
				'public/lib/angular-ui-grid/ui-grid.min.js',
				'public/lib/ftscroller/lib/ftscroller.js',
				'public/lib/dragscroll/dragscroll.js',
				'public/lib/pdfmake/build/pdfmake.min.js',
				'public/lib/pdfmake/build/vfs_fonts.js',
				'public/lib/ui-calendar/src/calendar.js',
				'public/lib/fullcalendar/dist/fullcalendar.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
