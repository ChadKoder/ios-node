PhotoDash.angular.controller('VideosCtrl', ['$q', '$scope', '$rootScope','$compile', '$http', 'selectionService', 
function($q, $scope, $rootScope, $compile, $http, selectionService) {
	var vm = this;
	vm.totalVideos = 0;
	vm.albums = [];
	
	vm.username = 'chad';
	vm.password = 'pass';
	vm.thumbnail = null;
	
	var currIndex = 0;
	var videoAlbumExists = false;
	
	vm.showPreloader = function(msg){
		PhotoDash.fw7.app.showPreloader(msg);
	};

	vm.hidePreloader = function(){
		PhotoDash.fw7.app.hidePreloader();
	};
	
	$scope.handleFiles = function(files){
		PhotoDash.fw7.app.alert('GOT FILES : ' + files.length);
	};
	
	vm.init = function(){ 
	vm.albums = selectionService.getVideoAlbums();
	/*
		vm.selectedVideos = selectionService.getVideos();
		
		if (vm.selectedVideos.length > 0){
				videoAlbumExists = true;
				var viewAlbumTemplate ='<li class="swipeout"><div class="swipeout-content"><a href="#" ng-click="vm.launchVideoBrowser()" class="item-content"><div class="item-media"><img ng-src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/file-video-icon.png" width="50"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">Video Album</div><div class="item-after">({{vm.selectedVideos.length}})</div></div><div class="item-subtitle">Review your videos</div></div></a></div><div class="swipeout-actions-left"><a id="video-send-btn" ng-click="vm.submitVideos()" class="bg-green action1">Send</a></div><div class="swipeout-actions-right"><a ng-click="vm.clearVideos()" class="swipeout-delete action2">Delete</a></div></li>';

				$$('#video-html-placeholder').append(viewAlbumTemplate);
				var newContent = angular.element(document.getElementById('video-html-placeholder'));

				$compile(newContent)($scope);
				$scope.$apply();
			}*/
	};
	
	vm.clickVideoInput = function(albumName){
		var fileEl = document.getElementById("video-input");
		
		if (fileEl){
			if (albumName){
				selectionService.setActiveVideoAlbum(albumName);
			}
			
			fileEl.click();			
		}
		
	};
	
	vm.clearVideos = function(albumName){ 
		//vm.selectedVideos = [];
		//videoAlbumExists = false;
		vm.albums = selectionService.removeVideoAlbum(albumName);
		document.querySelector('input#video-input').value = '';
	};
	
	
	var handleFiles = function() {
		console.log('GOT VIDEO FILE <--------');
		var videoFile = this.files[0];
		
		/*var item = {
		   'blob': videoFile,
		   'fileName': videoFile.name
		}*/
		
		selectionService.addVideo(videoFile);
		PhotoDash.fw7.app.closeModal('#popupsettings', true);
			/*if (vm.albums.length > 0 && !videoAlbumExists){
				videoAlbumExists = true;
				var viewAlbumTemplate ='<li class="swipeout"><div class="swipeout-content"><a href="#" ng-click="vm.launchVideoBrowser()" class="item-content"><div class="item-media"><img ng-src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/file-video-icon.png" width="50"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">Video Album</div><div class="item-after">({{vm.selectedVideos.length}})</div></div><div class="item-subtitle">Review your videos</div></div></a></div><div class="swipeout-actions-left"><a id="video-send-btn" ng-click="vm.submitVideos()" class="bg-green action1">Send</a></div><div class="swipeout-actions-right"><a ng-click="vm.clearVideos()" class="swipeout-delete action2">Delete</a></div></li>';

				$$('#video-html-placeholder').append(viewAlbumTemplate);
				var newContent = angular.element(document.getElementById('video-html-placeholder'));

				$compile(newContent)($scope);
			}*/
		
		$scope.$apply();
	};
	
	var inputElement = document.getElementById("video-input");
	inputElement.addEventListener("change", handleFiles, false);
	
	vm.submitVideos = function(albumName){
		var selectedAlbum = _.find(vm.albums, function(album){
			return album.albumName === albumName;
		});
		
		if (!vm.username || !vm.password) {
			PhotoDash.fw7.app.alert('username and password are required.');
			return;
		}
		
		vm.showPreloader();
		
		var encodedAuth = btoa(vm.username + ':' + vm.password);
		var formData = new FormData();
		formData.enctype = "multipart/form-data";
		
		console.log('submitting video album name: ' + selectedAlbum.albumName + 'total: ' + selectedAlbum.libraryItems.length);
		angular.forEach(selectedAlbum.libraryItems, function (obj) {
			console.log('appending fileName: ' + obj.fileName);
			formData.append('file', obj.blob, obj.fileName);
		});

		var url = 'http://192.168.1.109:8888/files?albumName=' + selectedAlbum.albumName + '&uploadDir=' + vm.settings.uploadDir;
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
	
		$http.post(url, formData, {
		   transformRequest: angular.identity,
		   headers: { 'Content-Type': undefined }
		   }).then(function(result) {
				   vm.hidePreloader();
				   PhotoDash.fw7.app.addNotification({
						 title: 'Upload Successful',
						 //subtitle: 'Album uploaded to PC!',
						 //message: 'Album uploaded to PC successfully!',
						 media: '<i class="f7-icons color-green">check_round_fill</i>'
						 });
				   }, function (err) {
				   alert('err: ' + JSON.stringify(err));
				   var errorStatus = err.status.toString().trim();
				   
				   vm.hidePreloader();
				   
				   switch (errorStatus) {
					   case '401':
						   PhotoDash.fw7.app.alert('username/password failed to authenticate!');
						   vm.username = '';
						   vm.password = '';
						   break;
					   case '-1':
						   PhotoDash.fw7.app.alert('Server not available');
						   break;
					   default:
						   PhotoDash.fw7.app.alert('An unknown error occurred!');
						   break;
				   }
		   });
	};
	
	vm.init();
}]);
