PhotoDash.angular.controller('VideoAlbumCtrl', ['$scope', '$compile', '$rootScope','fileService', '$http', function($scope, $compile, $rootScope, fileService, $http) {
	var vm = this;
	//var videos = [];

	vm.launchVideoBrowser = function(){
		var browserVideos = fileService.getVideos();
		//var browserVideos = [];
		/*for (var i = 0; i < videos.length; i++){
			var item = {
				html: '<video src="' + videos[i].src + '"></video>',
				caption: 'A Video'
			}
			
			browserVideos.push(item);
		}*/
		
		var videoBrowser = PhotoDash.fw7.app.photoBrowser({
			photos: browserVideos,
            onClose: function(){
                console.log('Detected browser close.');
                mainView.router.back();
            }
		});
        
		
		videoBrowser.open();
	};

	vm.init = function(){
		console.log('vm.init VideoAlbumCtrl');
		vm.launchVideoBrowser();
		$scope.$apply();
	};

	vm.init();

}]);
