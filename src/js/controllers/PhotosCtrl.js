PhotoDash.angular.controller('PhotosCtrl', ['$q', '$scope', '$rootScope','$compile', '$http', 'selectionService', 'authService', 
function($q, $scope, $rootScope, $compile, $http, selectionService, authService) {
	var vm = this;
	vm.totalPhotos = 0;
	vm.username = '';
	vm.password = '';
	vm.albumName = null;
	vm.selectedPhotos = [];
	vm.albums = [];
	
	var currIndex = 0;
	
	var selectedItems = [];
	var photoAlbumForm = new FormData();
	photoAlbumForm.enctype = 'multipart/form-data';
	
	vm.showPreloader = function(msg){
		PhotoDash.fw7.app.showPreloader(msg);
	};

	vm.hidePreloader = function(){
		PhotoDash.fw7.app.hidePreloader();
	};
	
	vm.openPhotoLibrary = function(){
		console.log('opening photo lib from phots ctrl....');
		mainView.router.loadPage('photo-album.html');
	};
	
	vm.createFilesAndSubmit = function(albumName){
		$http.defaults.headers.common.Authorization = authService.getAuthHeader(vm.settings.username, vm.settings.password);
		var albums = selectionService.getPhotoAlbums();
		var selectedAlbum = _.find(albums, function(album){
			return album.albumName === albumName;
		});
		
		var selectedItems = selectedAlbum.libraryItems;
		
		var defaultLimit = 1;
		var currLimit = 1;

		if (selectedItems.length < defaultLimit){
			currLimit = selectedItems.length;
		}

		var sendCtr = 0;
		
		var createAndSendPhotos = function(currIndex){
				cordova.plugins.photoLibrary.getPhoto(selectedItems[currIndex].id, function(photo){
						var form = new FormData();
						form.enctype = 'multipart/form-data';
						form.append('file', photo, selectedItems[currIndex].fileName);
						
						var url = 'http://192.168.1.109:8888/files?albumName=' + selectedAlbum.albumName + '&uploadDir=' + vm.settings.uploadDir;
						console.log('************URL ====> ' + url);
						$http.post(url, form, {
							transformRequest: angular.identity,
							headers: { 'Content-Type': undefined }
						}).then(function(result) {
							sendCtr++;
						 
							if (currIndex <= selectedItems.length){
							  setTimeout(function(i) {
							   createAndSendPhotos(i + 1); }, 700, currIndex);
							  if (currIndex === selectedItems.length - 1){
								vm.hidePreloader();
								   PhotoDash.fw7.app.addNotification({
										 title: 'Upload Successful',
										 //subtitle: 'Album uploaded to PC!',
										 //message: 'Album uploaded to PC successfully!',
										 media: '<i class="f7-icons color-green">check_round_fill</i>'
										 });
								}
						   }
								 
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
				});
		};

		createAndSendPhotos(0);
	};
	
	vm.clearPhotos = function(){
	  //photoAlbumExists = false;
	    vm.selectedPhotos = [];
	    selectionService.clearPhotos();
	};

	vm.submitPhotos = function(albumName){
		vm.showPreloader('Submitting album: ' + albumName);
		vm.createFilesAndSubmit(albumName);
	};

	/*vm.init = function(){ 
		vm.selectedPhotos = selectionService.getPhotos();
		
		if (vm.selectedPhotos.length > 0){
			 photoAlbumExists = true;
			vm.thumbnail = vm.selectedPhotos[0].thumbnailURL;
			
			var viewAlbumTemplate = '<li class="swipeout"><div class="swipeout-content"><a ng-href="album-review.html" class="item-content"><div class="item-media"><img ng-src="{{vm.thumbnail}}" width="50"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">Photo Album</div><div class="item-after">({{vm.selectedPhotos.length}})</div></div><div class="item-subtitle">Review your photos</div></div></a></div><div class="swipeout-actions-left"><a class="bg-green action1" ng-click="vm.submitPhotos()">Send</a><a href="photo-album.html" class="bg-lightblue action2">Add</a></div><div class="swipeout-actions-right"><a ng-click="vm.clearPhotos()" class="swipeout-delete action3">Delete</a></div></li>';
			$$('#photo-html-placeholder').append(viewAlbumTemplate);

			var newContent = angular.element(document.getElementById('photo-html-placeholder'));
			$compile(newContent)($scope);
			$scope.$apply();
		}
	};*/
	
	var ulElExists = false;
	
	vm.init = function(){ 
		vm.albums = selectionService.getPhotoAlbums();
		console.log('**** PhotosCtrl vm.init() called');
		console.log('totoal albums --> ' + vm.albums.length);
		
		if (!ulElExists &&  vm.albums.length > 0){
			//add UL element
			var ulEl = '<ul id="photo-html-placeholder"></ul>';
			$$('#ul-placeholder').append(ulEl);
			var newElContent = angular.element(document.getElementById('ul-placeholder'));
			$compile(newElContent)($scope);
			$scope.$apply();
			
			ulElExists = true;
		}
		 
		if (vm.albums.length > 0){
			console.log('albums exist... total ---> ' + vm.albums.length);
			for (var i = 0; i < vm.albums.length; i++){
				console.log('adding album #' + i + ' name == ' + vm.albums[i].albumName);
				//var currAlbum = vm.albums[i];
				//currAlbum.thumbnail = currAlbum.libraryItems[0].thumbnailURL;
				console.log('adding album ---> ' + vm.albums[i].albumName);
				/*var viewAlbumTemplate = '<li class="swipeout"><div class="swipeout-content"><a ng-href="album-review.html" class="item-content">' 
					+ '<div class="item-media"><img src="' + vm.albums[i].libraryItems[0].thumbnailURL + '" width="50"></div><div class="item-inner"><div class="item-title-row">'
					+ '<div class="item-title"><div ng-bind="vm.albums[' + i + '].albumName"></div><div class="item-after">({{vm.selectedPhotos.length}})</div></div><div class="item-subtitle">'
					+ 'Review your photos</div></div></a></div><div class="swipeout-actions-left"><a class="bg-green action1" ng-click="vm.submitPhotos(\'' + vm.albums[i].albumName + '\')">Send</a>'
					+ '<a href="photo-album.html" class="bg-lightblue action2">Add</a></div><div class="swipeout-actions-right">'
					+ '<a ng-click="vm.clearPhotos('+ vm.albums[i].albumName + ')" class="swipeout-delete action3">Delete</a></div></li>';
					*/
				var viewAlbumTemplate = '<li class="swipeout"><div class="swipeout-content"><a ng-href="album-review.html" class="item-content item-link"><div class="item-media"><img src="' + vm.albums[i].libraryItems[0].thumbnailURL + '" width="50" /></div><div class="item-inner" style="width: 100%;"><div class="item-title-row"><div class="item-title"><div ng-bind="vm.albums[' + i + '].albumName"></div></div><div class="item-after">(<div ng-bind="vm.albums[' + i + '].libraryItems.length"></div>)</div></div></div></a></div><div class="swipeout-actions-left"><a class="bg-green action1" ng-click="vm.submitPhotos(\'' + vm.albums[i].albumName + '\')">Send</a><a href="photo-album.html" class="bg-lightblue action2">Add</a></div><div class="swipeout-actions-right"><a ng-click="vm.clearPhotos('+ vm.albums[i].albumName + ')" class="swipeout-delete action3">Delete</a></div></li>';
					
				$$('#photo-html-placeholder').append(viewAlbumTemplate);

				var newContent = angular.element(document.getElementById('photo-html-placeholder'));
				$compile(newContent)($scope);
				
				$scope.$apply();
			}
		}
	};

	vm.init();
}]);