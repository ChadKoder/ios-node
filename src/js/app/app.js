
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
		templateUrl:'./views/photos.html',
		controller: 'MainCtrl',
		controllerAs: 'vm'
	})
	.otherwise({
		templateUrl:'./views/main.html',
		controller: 'MainCtrl',
		controllerAs: 'vm'
	});
})
.run(['$rootScope', function($rootScope) {
	 document.addEventListener("deviceready", onDeviceReady, false);
		 
		 function onDeviceReady() {
			 $rootScope.deviceReady = true;
             cordova.plugins.backgroundMode.enable();
                                                       
             if (!$rootScope.$$phase) {
                $rootScope.$apply();
             }
        };
}]);
