angular.module('dash-client').directive('topbar', ['settingsService', '$location',
function (settingsService, $location) {
	return {
		transclude: true,
		templateUrl:  './views/topbar.html',
		link: function(scope, element, attrs){
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
		}
	}
}]);