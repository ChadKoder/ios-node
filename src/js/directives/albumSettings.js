PhotoDash.angular.directive('albumSettings', ['$q', '$rootScope', '$compile', 'settingsService', '_',
 function ($q, $rootScope, $compile, settingsService, _) {
	return {
		restrict: 'E',
		scope: {
            userSettings: '=',
			title: '='
		},
		link: function (scope, element, attrs, ctrl) {
			scope.userSettings = settingsService.get();
			
			scope.openLibrary = function(){
				
				if (!scope.userSettings){
					PhotoDash.fw7.app.alert('Required info is missing!');
					return;
				}
				
				if (!scope.userSettings.username || !scope.userSettings.password || !scope.userSettings.albumName) {
					PhotoDash.fw7.app.alert('Required info is missing!');
					return;
				}
				
				settingsService.save(scope.userSettings);
				
				PhotoDash.fw7.app.closeModal('popup-settings', true);
				mainView.router.loadPage('photo-album.html');
			};
		
		},
		templateUrl: './settings.html'
	}
}]);
