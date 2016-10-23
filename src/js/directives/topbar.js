
angular.module('dash-client').directive('topbar', ['$http', function ($http) {
	return {
		transclude: true,
        require: '?ngModel',
		templateUrl: './views/topbar.html',
		replace: true,
		controller: 'TopbarCtrl',
		controllerAs: 'vm' 
	}
}]);
