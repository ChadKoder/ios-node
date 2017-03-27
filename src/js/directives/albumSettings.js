PhotoDash.angular.directive('albumSettings', ['$q', '$rootScope', '$compile', 'settingsService', '_', 'selectionService',
 function ($q, $rootScope, $compile, settingsService, _, selectionService) {
	return {
		restrict: 'E',
		scope: {
            userSettings: '=',
			title: '=',
			executeAction: '&?'
		},
		link: function (scope, element, attrs, ctrl) {
			scope.userSettings = settingsService.get();
			
			scope.next = function(){
				
				if (!scope.userSettings){
					PhotoDash.fw7.app.alert('Required info is missing!');
					return;
				}
				
				if (selectionService.doesAlbumExist(scope.userSettings.albumName)){
					console.log('***** ALBUM EXISTS. RETURNING!!!! CANT CONITNUE.....');
					return;
				} 
				
				if (!scope.userSettings.username || !scope.userSettings.password || !scope.userSettings.albumName || !scope.userSettings.uploadDir) {
					PhotoDash.fw7.app.alert('Required info is missing!');
					return;
				}
				
				settingsService.save(scope.userSettings);
				
				PhotoDash.fw7.app.closeModal('popup-settings', true);
				
				if (scope.executeAction !== undefined){
					scope.executeAction();
				}
			};
		
		},
		templateUrl: './settings.html'
	}
}]);
