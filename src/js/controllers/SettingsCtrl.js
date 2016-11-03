angular.module('dash-client')
.controller('SettingsCtrl', ['$location',
function ($location) {
	var vm = this;
	
	vm.go = function(url){ 
		$location.url(url);
	};

	vm.openSettings = function ($mdOpenMenu, e){
		$mdOpenMenu(e);
	};
	
	 
	
}]);