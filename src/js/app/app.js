
var app = angular.module('photoSaverApp', ['ngMaterial', 'ngRoute', 'MainCtrl', 'angular-loading-bar', 'lfNgMdFileInput']);
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
                                                       
             if (!$rootScope.$$phase) {
                $rootScope.$apply();
             }
        };
}]);
