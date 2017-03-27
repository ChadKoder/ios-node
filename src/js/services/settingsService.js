PhotoDash.angular.factory('settingsService', ['authService', 'selectionService',
	function (authService, selectionService) {
       var service = this;
		
		var get = function(){
			/***TODO: save full settings minus creds?
			**** as an array to save multiple albums?
			***/
			return JSON.parse(window.localStorage.getItem('settings'));
		};
		
		var save = function(settings){
			authService.saveUserCreds(settings.username, settings.password);
			window.localStorage.setItem('settings', JSON.stringify(settings));
			//currentAlbum = settings.albumName;
			console.log('*** settingsService **** CAlling selectionService.setActiveAlbum : aname -- ' + settings.albumName);
			selectionService.setActiveAlbum(settings.albumName);
			console.log('settings saved...');
		};
		
		return {
			get: get,
			save: save
		}
 }]);
