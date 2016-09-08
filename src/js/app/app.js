
var app = angular.module('photoSaverApp', ['ngMaterial', 'ngRoute', 'ngAnimate', 'dash-client', 'angular-loading-bar']);
app.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
	
	$routeProvider
	.when('/', {
		templateUrl:'./views/main.html',
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
