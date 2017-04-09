PhotoDash.angular.directive('albumSettings', ['$rootScope', 'settingsService', '_', 
 function ($rootScope, settingsService, _) {
	return {
		restrict: 'E',
		scope: {
            userSettings: '=',
			title: '=',
			albumType: '=',
			popupName: '=',
			executeAction: '&?'
		},
		link: function (scope, element, attrs, ctrl) {			
			scope.userSettings = settingsService.get();
			
			scope.closeSettings = function(){
					//PhotoDash.fw7.app.closeModal('.' + scope.popupName, true);
					PhotoDash.fw7.app.closeModal();
			};
			
			scope.next = function(){
				
				if (!scope.userSettings){
					PhotoDash.fw7.app.alert('Required info is missing!');
					return;
				}
				
				
				/*if (selectionService.doesAlbumExist(scope.userSettings.albumName)){
					PhotoDash.fw7.app.alert('Album already exists!');
					return;
				} */
				
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
				
				if (scope.executeAction !== undefined){
					scope.executeAction();
				}
			};
		},
		templateUrl: 'settings.html'
	}
}]);
