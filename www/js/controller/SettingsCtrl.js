PhotoDash.angular.controller('SettingsCtrl', function() {
	var vm = this;
	vm.saveSettings = function (){
		 var credentials = btoa(vm.username + ':' + vm.password);
		 var localStorage = window.localStorage;
		 var settings = {
			 ipAddress: vm.ipAddress,
			 //	deviceName: vm.deviceName,
			 accountId: vm.accountId,
			 credentials: credentials,
			 uploadDir: vm.uploadDir,
			 albumName: vm.albumName
		 }
		 
		localStorage.setItem('accountId', vm.accountId);
		localStorage.setItem('ipAddress', vm.ipAddress);
		localStorage.setItem('credentials', credentials);
		localStorage.setItem('uploadDir', vm.uploadDir);
		localStorage.setItem('albumName', vm.albumName);
		 alert('saved settings to local storage!');
		/* httpService.post('/settings', credentials, settings)
		 .then(function(result) {
			  // vm.inProgress = false;
			   alert('settings saved!');
			   }, function (err) {
			  // vm.inProgress = false;
			   alert('error: ' + JSON.stringify(err));
			   });*/
		 // alert('1111');
		  // ngModel.saveSettings();
		 // this.saveSettings();
	 
	};
	
	vm.getSettings = function (){
		var localStorage = window.localStorage;

		vm.ipAddress = localStorage.getItem('ipAddress');
		var creds = localStorage.getItem('credentials');
		vm.uploadDir = localStorage.getItem('uploadDir');
		vm.albumName = localStorage.getItem('albumName');
		var credString = atob(creds);
		//alert('credsString: ' + credString);
		var credsSplit = credString.split(':');

		if (credsSplit) {
			vm.username = credsSplit[0];
			vm.password = credsSplit[1];
		}
		//alert('settings: ' + settings.ipAddress);
		//return settings;
	};
	
	vm.init = function(){
		
	};

});
