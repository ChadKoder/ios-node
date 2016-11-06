angular.module('dash-client').factory('settingsService', [
    function () {
		function settingsService() {
			var self = this;
		
			self.getLocal = function (){
				var localStorage = window.localStorage;
				var settings = {
					username: '',
					password: '',
					ipAddress: '',
					albumName: '',
					uploadDir: ''
				} 
				
				settings.ipAddress = localStorage.getItem('ipAddress');
				var creds = localStorage.getItem('credentials');
				settings.uploadDir = localStorage.getItem('uploadDir');
				settings.albumName = localStorage.getItem('albumName');
				var credString = atob(creds);
				//alert('credsString: ' + credString);
				var credsSplit = credString.split(':');
			
				if (credsSplit) {
					settings.username = credsSplit[0];
					settings.password = credsSplit[1];
				}
				//alert('settings: ' + settings.ipAddress);
				return settings;
			}
		}
		
		return new settingsService();
	}
]);