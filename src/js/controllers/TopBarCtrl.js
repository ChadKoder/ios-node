angular.module('dash-client')
.controller('TopbarCtrl', ['$location', 'settingsService',
function ($location, settingsService) {
	var vm = this;
	vm.ipAddress = '';
	vm.username = '';
	vm.password = '';
	vm.uploadDir = '';
	vm.albumName = '';
    
   vm.activePhotosStyle = {
		'width': '50px',
		'height': '50px',
		'fill': 'white'
   }; 
   
   vm.inactivePhotosStyle = {
		'width': '50px',
		'height': '50px',
		'fill': 'black'
   };
   
   vm.photosIconStyle = vm.inactivePhotosStyle;
   vm.videosIcon = vm.inactiveVideosIcon;
   vm.contactsIcon = vm.inactiveContactsIcon;
	
	vm.go = function(url){
		$location.url(url);
		  if ( url === '/photos'){
			  vm.photosIconStyle = vm.activePhotosStyle;
			  vm.videosIcon = vm.inactiveVideosIcon;
			  vm.contactsIcon = vm.inactiveContactsIcon;
        }
        if (url === '/videos'){
            vm.videosIcon = vm.activeVideosIcon;
            vm.photosIconStyle = vm.inactivePhotosStyle;
            vm.contactsIcon = vm.inactiveContactsIcon;
                    }
        if (url === '/contacts'){
            vm.contactsIcon = vm.activeContactsIcon;
            vm.photosIconStyle = vm.inactivePhotosStyle;
            vm.videosIcon = vm.inactiveVideosIcon;
        }
	};
	vm.getSettings = function (){
		var localStorage = window.localStorage;
		var settings = settingsService.getLocal();
		
		vm.uploadDir = settings.uploadDir;
		vm.albumName = settings.albumName;
		vm.ipAddress = settings.ipAddress;
		vm.username = settings.username;
		vm.password = settings.password;
	};
	
	vm.getSettings();

}]);