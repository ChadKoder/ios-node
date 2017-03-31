PhotoDash.angular.directive('albumSettings', ['$q', '$rootScope', '$compile', 'settingsService', '_', 'selectionService',
 function ($q, $rootScope, $compile, settingsService, _, selectionService) {
	return {
		restrict: 'E',
		scope: {
            userSettings: '=',
			title: '=',
			albumType: '=',
			executeAction: '&?'
		},
		link: function (scope, element, attrs, ctrl) {
			scope.userSettings = settingsService.get();
			
			scope.openPopup = function(){
				console.log('Attempting to open popup..');
				//  var template = $templateCache.get('popup-settings.html');
				//PhotoDash.fw7.app.popup('popup-settings.html', true, true);
			};
			
			scope.next = function(){
				
				if (!scope.userSettings){
					PhotoDash.fw7.app.alert('Required info is missing!');
					return;
				}
				
				if (selectionService.doesAlbumExist(scope.userSettings.albumName)){
					/***TODO: focus on first element that's missing?***/
					PhotoDash.fw7.app.alert('Album already exists!');
					return;
				} 
				
				if (!scope.userSettings.username || !scope.userSettings.password || !scope.userSettings.albumName || !scope.userSettings.uploadDir) {
					PhotoDash.fw7.app.alert('Required info is missing!');
					return;
				}
				
				if (scope.albumType){
					if (scope.albumType === 'photo'){
						settingsService.savePhotoAlbumSettings(scope.userSettings);
					}
					
					if (scope.albumType === 'video'){
						settingsService.saveVideoAlbumSettings(scope.userSettings);
					}
				}
				
				//PhotoDash.fw7.app.closeModal('#popupsettings', true);
				
				if (scope.executeAction !== undefined){
					scope.executeAction();
				}
			};
		
		},
		templateUrl: './settings.html'
	}
}]);
