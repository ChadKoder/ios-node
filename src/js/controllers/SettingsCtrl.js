angular.module('dash-client')
.controller('SettingsCtrl', ['httpService', 'settingsService',
function (httpService, settingsService) {
	var vm = this;
	vm.accountId = '';
	vm.ipAddress = '';
	vm.username = '';
	vm.password = '';
	vm.uploadDir = '';
	vm.albumName = '';
	
	vm.openSettings = function ($mdOpenMenu, e){
		$mdOpenMenu(e);
	};
	
	vm.getSettings = function (){
		//var localStorage = window.localStorage;
		var settings = settingsService.getLocal();
		
		vm.accountId = settings.accountId;
		vm.uploadDir = settings.uploadDir;
		vm.albumName = settings.albumName;
		vm.ipAddress = settings.ipAddress;
		vm.username = settings.username;
		vm.password = settings.password;
	};
	
	vm.saveSettings = function (){
		 var credentials = btoa(vm.username + ':' + vm.password);
		 var localStorage = window.localStorage;
		 var settings = {
			 ipAddress: vm.ipAddress,
			 //	deviceName: vm.deviceName,
			 credentials: credentials,
			 uploadDir: vm.uploadDir,
			 albumName: vm.albumName
		 }
		 
		localStorage.setItem('accountId', vm.accountId);
		localStorage.setItem('ipAddress', vm.ipAddress);
		localStorage.setItem('credentials', credentials);
		localStorage.setItem('uploadDir', vm.uploadDir);
		localStorage.setItem('albumName', vm.albumName);
		 
		 httpService.post('/settings', settings)
		 .then(function(result) {
			  // vm.inProgress = false;
			   alert('settings saved!');
			   }, function (err) {
			  // vm.inProgress = false;
			   alert('error: ' + err);
			   });
		 // alert('1111');
		  // ngModel.saveSettings();
		 // this.saveSettings();
	 
	};
	
	vm.getSettings();
	
}]);