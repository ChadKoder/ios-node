
var app = angular.module('dash-client', ['ngMaterial', 'ngRoute', 'ngAnimate', 'angular-loading-bar']);

app.constant('_', window._);
app.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});
	
	$routeProvider
	.when('/', {
		templateUrl:'./views/main.html',
		controller: 'MainCtrl',
		controllerAs: 'vm'
	})
	.when('/photos', {
		templateUrl: './views/photos.html',
		controller: 'PhotosCtrl',
		controllerAs: 'vm'
	})
	.when('/videos', {
		templateUrl: './views/videos.html',
		controller: 'VideosCtrl',
		controllerAs: 'vm'
	})
	.when('/contacts', {
		templateUrl: './views/contacts.html',
		controller: 'ContactsCtrl',
		controllerAs: 'vm'
	})
	.otherwise({
		templateUrl:'./views/main.html',
		controller: 'MainCtrl',
		controllerAs: 'vm'
	});
});
