angular.module('dash-client').directive('topbar', ['settingsService', '$location',
function (settingsService, $location) {
	return {
		transclude: true,
		require: '?ngModel',
		templateUrl: './views/topbar.html',
		replace: true,
		link: function(scope, element, attrs){
            scope.accountId = '';
			scope.ipAddress = '';
			scope.username = '';
			scope.password = '';
			scope.uploadDir = '';
			scope.albumName = '';
			var width = '42px', height = '42px';
			
		   scope.activeIconStyle = {
				'width': '48px',
				'height': '48px',
				'fill': 'white'
		   }; 
		   
		   scope.inactiveIconStyle = {
				'width': width,
				'height': height,
				'fill': 'black'
		   };
		   
		   scope.photosIconStyle = scope.inactiveIconStyle;
		   scope.videosIconStyle = scope.inactiveIconStyle;
		   scope.contactsIconStyle = scope.inactiveIconStyle;
			
			scope.go = function(url){
				$location.url(url);
				
				if ( url === '/photos'){
				  scope.photosIconStyle = scope.activeIconStyle;
				  scope.videosIconStyle = scope.inactiveIconStyle;
				  scope.contactsIconStyle = scope.inactiveIconStyle; 
				}
				if (url === '/videos'){
					scope.videosIconStyle = scope.activeIconStyle;
					scope.photosIconStyle = scope.inactiveIconStyle;
					scope.contactsIconStyle = scope.inactiveIconStyle; 
				}
				if (url === '/contacts'){
					scope.contactsIconStyle = scope.activeIconStyle;
					scope.photosIconStyle = scope.inactiveIconStyle;
					scope.videosIconStyle = scope.inactiveIconStyle;
				}
				
				if (!scope.$$phase){
					$scope.$apply();
				}
			};
			scope.getSettings = function (){
				var localStorage = window.localStorage;
				var settings = settingsService.getLocal();
				
                scope.accountId = settings.accountId;
				scope.uploadDir = settings.uploadDir;
				scope.albumName = settings.albumName;
				scope.ipAddress = settings.ipAddress;
				scope.username = settings.username;
				scope.password = settings.password;
			};
			
			scope.getSettings();
			
		}
	}
}]);