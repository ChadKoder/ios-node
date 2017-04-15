PhotoDash.angular.controller('VideosCtrl', ['$q', '$scope', '$rootScope', '$http', 'videoAlbumService', '_',
function($q, $scope, $rootScope, $http, videoAlbumService, _) {
	var vm = this;
	
	var activeAlbumName = '';
	vm.totalVideos = 0;
	vm.albums = [];
	vm.videoFile = null;
	
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
		
	vm.openSettings = function(){
		setTimeout(function(){
			PhotoDash.fw7.app.popup('.popup-settings', true, true);
		}, 800);
	};
		
	vm.init = function(){ 
		//vm.albums = null;// selectionService.getVideoAlbums();
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
		
		if (albumName){
			activeAlbumName = albumName;
		} else {
			activeAlbum = vm.settings.albumName;
		}		
		
		var fileEl = document.getElementById("video-input");
		
		if (fileEl){
			if (albumName){
				//selectionService.setActiveVideoAlbum(albumName);
			}
			
			fileEl.click();			
		}		
	};
	
	vm.clearVideos = function(albumName){ 
		//vm.selectedVideos = [];
		//videoAlbumExists = false;
		PhotoDash.fw7.app.swipeoutDelete('#' + albumName, function(){
			
			
			
			vm.albums = [];
			
			//var inputEl = document.getElementById('video-input');
			//inputEl.parentNode.removeChild(inputEl);
	   });
		 
		//document.querySelector('input#video-input').value = '';
		//document.getElementById('video-input').value = null;
		 
	};
	var createThumbnailSuccess = function(result) {
    // result is the path to the jpeg image on the device
    console.log('createThumbnailSuccess, result: ' + result);
	};
	
	var createThumbnailError = function(err) {
    // result is the path to the jpeg image on the device
    console.log('creat thumb ERROR, result: ' + err);
	};
	
	var handleFiles = function() {
		console.log('handilng video file..');
		var videoFile = this.files[0];
		
		var existingAlbum = _.findWhere(vm.albums, { name: activeAlbumName });
		
		if (existingAlbum){
			
		} else {
			videoAlbumService.createAlbum(activeAlbumName, videoFile, function(newAlbum){
				vm.albums.push(newAlbum);
			});
		}
				
		setTimeout(function(){
			//var album =null;
			
			angular.element("input[type='file']").val(null);
			this.files = null;
			
			
			PhotoDash.fw7.app.closeModal();
			//PhotoDash.fw7.app.swipeoutClose('#' + album.name, function(){
			//	console.log('swipe out closed....');
			//});
			$scope.$apply();
			
		}, 500);
		
			
	};
	
	vm.selectAlbum = function (albumName){
		//selectionService.setActiveVideoAlbum(albumName);
		//var activeAlbum = selectionService.getActivePhotoAlbum();
		//$scope.thumbnails = activeAlbum.libraryItems;
		//PhotoDash.fw7.app.popup('.popup-library');
		
		
		setTimeout(function(){
			
			//var activeAlbum = selectionService.getActiveVideoAlbum();
			var activeAlbum = _.findWhere(vm.albums, { name: albumName });
			var videos = [];
			
			for (var i = 0; i < activeAlbum.libraryItems.length; i++){
				 var videoURL = window.URL.createObjectURL(activeAlbum.libraryItems[i].file);
				 // var caption = (i + 1) + ' / ' + activeAlbum.libraryItems.length;
				var item = {
					html: '<video style="width: 50%; height: 50%;" src="' + videoURL + '"></video>'
					//html: '<video controls style="padding-top: 40px;"><source src="' + videoURL + '" type="video/mp4"></video>',
					//caption: caption
				};
				
				videos.push(item);
			}
			
			var videoBrowser = PhotoDash.fw7.app.photoBrowser({
				photos: videos,
				type: 'popup',
				theme: 'dark', 
				swipeToClose: true,
				toolbar: true,
				navbar: true
			});
			
			videoBrowser.open();
			
		}, 200);
	};
	
	
	var inputElement = document.getElementById("video-input");
	inputElement.addEventListener("change", handleFiles, false);
	
	vm.submitVideos = function(albumName){
		var selectedAlbum = _.find(vm.albums, function(album){
			return album.name === albumName;
		});
		
		if (!vm.username || !vm.password) {
			PhotoDash.fw7.app.alert('username and password are required.');
			return;
		}
		
		vm.showPreloader();
		
		var encodedAuth = btoa(vm.username + ':' + vm.password);
		var formData = new FormData();
		formData.enctype = "multipart/form-data";
		
		console.log('submitting video album name: ' + selectedAlbum.name + 'total: ' + selectedAlbum.libraryItems.length);
		angular.forEach(selectedAlbum.libraryItems, function (obj) {
			console.log('appending fileName: ' + obj.fileName);
			formData.append('file', obj.blob, obj.fileName);
		});

		var url = 'http://192.168.1.109:8888/files?albumName=' + selectedAlbum.name + '&uploadDir=' + vm.settings.uploadDir;
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
