PhotoDash.angular.controller('PhotosCtrl', ['$q', '$scope', '$rootScope','$compile', '$http', 'fileService', 'selectionService', 
function($q, $scope, $rootScope, $compile, $http,fileService, selectionService) {
	var vm = this;
	vm.totalVideos = 0;
	vm.videos = [];
	vm.totalPhotos = 0;
	vm.username = 'chad';
	vm.password = 'pass';
	vm.thumbnails = [];
	vm.thumbnail = null;
	vm.selectedPhotos = [];
	var currIndex = 0;
	var videoAlbumExists = false;
	vm.showPreloader = function(msg){
		PhotoDash.fw7.app.showPreloader(msg);
	};

	vm.hidePreloader = function(){
		PhotoDash.fw7.app.hidePreloader();
	};
		
	vm.createFilesAndSubmit = function(){
		var promises = [];
		var selectedItems = selectionService.get();
		var defaultLimit = 5;
		var currLimit = 5;

		if (selectedItems.length < defaultLimit){
			currLimit = selectedItems.length;
		}

		var createAndSendPhotos = function(currIndex){
			var limitTo = (currLimit + currIndex);
			var ctr = 0;

			for (var i = currIndex; i < limitTo; i++){

				cordova.plugins.photoLibrary.getPhoto(selectedItems[i].id, function(photo){


					var fileName = selectedItems[currIndex].fileName;
					var encodedAuth = btoa(vm.username + ':' + vm.password);
					$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;

					var formData = new FormData();
					formData.enctype = "multipart/form-data";

					formData.append('file', photo, fileName);

					promises.push($http.post('http://192.168.1.109:8888' + '/files', formData, {
					transformRequest: angular.identity,
					headers: { 'Content-Type': undefined }
					}));

					console.log('CTR === ' + ctr + ' currIdnex === ' + currIndex);

					if ((ctr === (currLimit - 1)) && (currIndex !== (selectedItems.length - 1))){
					console.log('******CALLING AGAIN....FOR  NEXT 5');
					setTimeout(function(currIndex) { createAndSendPhotos(currIndex + 1); }, 1500, currIndex);
					}

					if (currIndex === (selectedItems.length - 1)){
						$q.all(promises).then(function(){
							PhotoDash.fw7.app.hidePreloader();
							PhotoDash.fw7.app.addNotification({
								title: 'Upload Successful',
								//subtitle: 'Album uploaded to PC!',
								//message: 'Album uploaded to PC successfully!',
								media: '<i class="f7-icons color-green">check_round_fill</i>'
							});
						}, function (err) {
								var errorStatus = err.status.toString().trim();
								switch (errorStatus) {
									case '401':
										PhotoDash.fw7.app.alert('username/password failed to authenticate!');
										vm.username = '';
										vm.password = '';
										break;
									case '-1':
										PhotoDash.fw7.app.alert('Server not available: ' + JSON.stringify(err));
										break;
									default:
										PhotoDash.fw7.app.alert('An unknown error occurred!');
										break;
								}
						});
					}
					ctr++;
					currIndex++;

					}, function (err){
					console.log('error pushing file...');
				});
			}
		};

		createAndSendPhotos(0);
	};
	
	vm.clearPhotos = function(){
	  console.log('CLEARING ALL SELECTED PHOTOS');
	    vm.selectedPhotos = [];
	    selectionService.clear();
	};

	vm.submitPhotos = function(){
		vm.showPreloader('Submitting album to your PC...');
		vm.createFilesAndSubmit();
	};

	vm.init = function(){
		vm.selectedPhotos = selectionService.get();

		if (vm.selectedPhotos.length > 0){
			vm.thumbnail = vm.selectedPhotos[0].thumbnailURL;
			var viewAlbumTemplate = '<li class="swipeout"><div class="swipeout-content"><a ng-href="album-review.html" class="item-content"><div class="item-media"><img ng-src="{{vm.thumbnail}}" width="50"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">Photo Album</div><div class="item-after">({{vm.selectedPhotos.length}})</div></div><div class="item-subtitle">Review your photos</div></div></a></div><div class="swipeout-actions-left"><a class="bg-lightblue action3" ng-click="vm.submitPhotos()">Send</a></div><div class="swipeout-actions-right"><a ng-click="vm.clearPhotos()" class="swipeout-delete action4">Delete</a></div></li>';

			$$('#photo-html-placeholder').append(viewAlbumTemplate);

			var newContent = angular.element(document.getElementById('photo-html-placeholder'));
			$compile(newContent)($scope);
			$scope.$apply();
		}
	};

	vm.init();

	vm.getImgElement = function(pid){
		var imageEls = document.querySelectorAll('img');

		for (var i = 0; i < imageEls.length; i++){
			var imageEl = imageEls[i];
			var imagepid = imageEl.getAttribute('id');
			if (pid === imagepid){
				return imageEl;
				break;
			}
		}

		return null;
	};
	
	vm.showAlbum = function(pid){
		/*TODO: move to album preview page*/
		for (var i = 0; i < vm.thumbnails.length; i++){
			vm.thumbnails[i].el = vm.getImgElement(vm.thumbnails[i].pid);

			if (vm.thumbnails[i].pid === pid){
				currIndex = i;
			}
		}

		var pswpElement = document.querySelectorAll('.pswp')[0];

		var options = vm.getOptions();
		options.index = currIndex;

		var gallery = new PhotoSwipe(pswpElement, false, vm.thumbnails, options);
		gallery.listen('destroy', function(){});
		gallery.listen('imageLoadComplete', function(index, item){});
	};

	var onErrorReadFile = function(){
		console.log('error reading file...');
	};

	vm.launchVideoStream = function() {
		//TODO: Remove or use.
		// Play a video with callbacks
		var options = {
			mustWatch: true,
			successCallback: function() {
				console.log("Video was closed without error??");
			},
			errorCallback: function(errMsg) {
				console.log("Error! " + errMsg);
			}
		}; 
		var videos = fileService.getVideos();
		var vid = videos[0];
		window.plugins.streamingMedia.playVideo(vid, options);
	};

	vm.clearVideos = function(){
		vm.videos = [];
	};

	vm.showSlideshow = function(index){
		vm.showAlbum(index);
	};

	vm.testGetLocalPhotos = function(){
		vm.getLocalPhotos();
	};

	vm.openInAppPhotoAlbum = function (){
		vm.inAppBrowser.show();
	};

	$$('#video-input').on('change', function(e){
		var videoFile = document.querySelector('input#video-input').files[0];
		
		var item = {
		   'blob': videoFile,
		   'fileName': videoFile.name
		}
		
		vm.videos.push(item);
		
			if (vm.videos.length > 0 && !videoAlbumExists){
				videoAlbumExists = true;
				var viewAlbumTemplate ='<li class="swipeout"><div class="swipeout-content"><a href="#" ng-click="vm.launchVideoBrowser()" class="item-content"><div class="item-media"><img ng-src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/file-video-icon.png" width="50"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">Video Album</div><div class="item-after">({{vm.videos.length}})</div></div><div class="item-subtitle">Review your videos</div></div></a></div><div class="swipeout-actions-left"><a id="video-send-btn" ng-click="vm.submitVideos()" class="bg-green action1">Send</a></div><div class="swipeout-actions-right"><a ng-click="vm.clearVideos()" class="swipeout-delete action2">Delete</a></div></li>';

				$$('#video-html-placeholder').append(viewAlbumTemplate);
				var newContent = angular.element(document.getElementById('video-html-placeholder'));

				$compile(newContent)($scope);
				//$scope.$apply();
			}
		
		$scope.$apply();
	});	
	
	vm.submitVideos = function(){
		if (!vm.username || !vm.password) {
			PhotoDash.fw7.app.alert('username and password are required.');
			return;
		}
		
		vm.showPreloader();
		console.log('submitting total : ' + vm.videos.length);
		
		var encodedAuth = btoa(vm.username + ':' + vm.password);
		var formData = new FormData();
		formData.enctype = "multipart/form-data";
		
		angular.forEach(vm.videos, function (obj) {
			console.log('ADDING FILE NAME : ' + obj.fileName);
			console.log('dading BLOB: ' + obj.blob);
			formData.append('file', obj.blob, obj.fileName);
		});
		
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
	
		$http.post('http://192.168.1.109:8888' + '/files', formData, {
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
}]);
