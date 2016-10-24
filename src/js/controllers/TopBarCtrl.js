angular.module('dash-client')
.controller('TopbarCtrl', ['$location', 'settingsFactory',
function ($location, settingsFactory) {
	var vm = this;
	vm.ipAddress = '';
	vm.username = '';
	vm.password = '';
	vm.uploadDir = '';
	vm.albumName = '';
	
	vm.go = function(url){
		$location.url(url);
	};
	vm.getSettings = function (){
		var localStorage = window.localStorage;
		var settings = settingsFactory.getLocal();
		
		vm.uploadDir = settings.uploadDir;
		vm.albumName = settings.albumName;
		vm.ipAddress = settings.ipAddress;
		vm.username = settings.username;
		vm.password = settings.password;
	};
	
	vm.getSettings();

}]);