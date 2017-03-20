PhotoDash.angular.factory('settingsService', ['authService', 
	function (authService) {
       var service = this;
		
		var get = function(){
			var creds = authService.getUserCreds();
			console.log('settingsService -- userCred: ' + creds);
			/***TODO: save full settings minus creds?
			**** as an array to save multiple albums?
			***/
			return JSON.parse(window.localStorage.getItem('settings'));
		};
		
		var save = function(settings){
			authService.saveUserCreds(settings.username, settings.password);
			window.localStorage.setItem('settings', JSON.stringify(settings));
			console.log('settings saved...');
		};
		
		return {
			get: get,
			save: save
		}
 }]);
