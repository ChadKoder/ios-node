PhotoDash.angular.factory('settingsService', ['authService', 'selectionService',
	function (authService, selectionService) {
       var service = this;
		
		var saveSettings = function(settings){
			authService.saveUserCreds(settings.username, settings.password);
			window.localStorage.setItem('settings', JSON.stringify(settings));
		};
		
		var get = function(){
			/***TODO: save full settings minus creds?
			**** as an array to save multiple albums?
			***/
			return JSON.parse(window.localStorage.getItem('settings'));
		};
		
		var savePhotoSettings = function(settings){
			saveSettings(settings);
			selectionService.setActivePhotoAlbum(settings.albumName);
			console.log('settings saved...');
		};
		
		var getVideoAlbumSettings = function(){
			
		};
		
		var saveVideoSettings = function(settings){
			saveSettings(settings);
			selectionService.setActiveVideoAlbum(settings.albumName);
		};
		
		return {
			get: get,
			savePhotoAlbumSettings: savePhotoSettings,
			saveVideoAlbumSettings: saveVideoSettings
		}
 }]);
