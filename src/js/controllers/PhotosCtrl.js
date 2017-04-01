PhotoDash.angular.controller('PhotosCtrl', ['$q', '$scope', '$rootScope','$compile', '$http', 'selectionService', 'authService', 
function($q, $scope, $rootScope, $compile, $http, selectionService, authService) {
	var vm = this;
	vm.totalPhotos = 0;
	vm.username = '';
	vm.password = '';
	vm.albumName = null;
	vm.selectedPhotos = [];
	vm.albums = [];
	var loading = false;
	var currIndex = 0;
	
	var itemsPerLoad = 48;
			$scope.thumbnailLimit = 84;
            $scope.selectedItems = [];
            $scope.totalSelected = 0;
	
	var selectedItems = [];
	var photoAlbumForm = new FormData();
	photoAlbumForm.enctype = 'multipart/form-data';
	
	vm.showPreloader = function(msg){
		PhotoDash.fw7.app.showPreloader(msg);
	};

	
	$scope.isSelected = function(id){
				return _.contains($scope.selectedItems, id);
   };
		
	$scope.markSelected = function(libraryItem){
		var alreadySelected = _.contains($scope.selectedItems, libraryItem.id);
		
		if (alreadySelected){
			$scope.selectedItems = _.reject($scope.selectedItems, function (itemId){
				return itemId === libraryItem.id;
			});
			
			selectionService.remove(libraryItem.id);
			$scope.totalSelected--;
			
		} else {
			$scope.selectedItems.push(libraryItem.id);
			selectionService.addPhoto(libraryItem);
			 $scope.totalSelected++;
		}
	};
			
	vm.hidePreloader = function(){
		PhotoDash.fw7.app.hidePreloader();
	};
	
	$scope.closePopup = function(){
		PhotoDash.fw7.app.closeModal('#popuplibrary', true);
	};
	
	var getPicture = function(){
		PhotoDash.fw7.app.alert('Take Photo is not implemented!');
		return;
		navigator.camera.getPicture(onSuccess, onFail, { quality: 100,
			destinationType: Camera.DestinationType.FILE_URI });

		function onSuccess(imageURI) {
			/***TODO: get active album name...***/
			var album = {
				albumName: 'manualAlbum',
				libraryItems: [libraryItem]
			};
			
			vm.albums.push(album);
			//PhotoDash.fw7.app.alert('imageURI: ' + imageURI);
		}

		function onFail(message) {
			PhotoDash.fw7.app.alert('Failed because: ' + message);
		}
	};
	
	
	var requestAuthorization = function(){
				cordova.plugins.photoLibrary.requestAuthorization(
				  function () {
					//User allowed access
					getPhotoLibrary();
				  },
				  function (err) {
					// User denied access
					console.log('User denied access to photo library.');
				  }, 
				  {
					read: true,
					write: true
				  });
			};
			
			var getPhotoLibrary = function(){
				console.log('getting photot album ***NEW*******');
				cordova.plugins.photoLibrary.getLibrary(function (result) {
						$scope.thumbnails = result.library;
						console.log('got photo library ***NEW***');
						$scope.totalPhotos = result.library.length;
						//$scope.selectedItems = _.pluck(selectionService.getPhotos(), 'id');
						//$scope.totalSelected = $scope.selectedItems.length;
						PhotoDash.fw7.app.hidePreloader();
						$scope.$apply();
						
					}, function(err){
						if (err.startsWith('Permission')) {
							requestAuthorization();
						} else {
							console.log('getFullLibrary failed with error: ' + err);
						}
					},{
					
						thumbnailWidth: 80,
                        thumbnailHeight: 80
					});
			};
			
			
	vm.openPhotoLibrary = function(){
		var cameraButtons = [{
			text: 'Take Photo',
			isCapturePhoto: true,
			color: 'black',
			onClick: function(){
				PhotoDash.fw7.app.closeModal('#popupsettings', true);
				//PhotoDash.fw7.app.alert('Temp take a photo click!');
				getPicture();
			}
		},
		{
			text: 'Photo Library',
			isLibrary: true,
			color: 'black',
			onClick: function(){
				PhotoDash.fw7.app.closeModal('#popupsettings', true);
				//var libraryPopupTemplate = '<div id="popuplibrary" class="popup popup-library" style="background-color: #222426; font-size: 12px;">		<div ng-controller="PhotoAlbumCtrl as vm" class="content-block">			<div style="display: inline; position: relative;" 					ng-repeat="item in thumbnails | orderBy: \'-creationDate\' | limitTo: thumbnailLimit track by item.id">				<img ng-click="markSelected(item)" 						width="75" 						style="display: inline; position: relative;" 						id="{{item.id}}" 						ng-src="{{item.thumbnailURL}}" />				<i ng-if="isSelected(item.id)" 					class="f7-icons color-blue" 					style="position: absolute; top: -4px; right: 4px; display:inline; font-size: 20px; background-color: white; border-radius: 100%;">						check_round_fill				</i>			</div>			<div class="infinite-scroll-preloader">				<div class="preloader">				</div>			</div>		</div>	</div>';
				//var libraryPopupTemplate = '<div id="popuplibrary" class="popup popup-library" style="background-color: #222426; font-size: 12px;"><div class="navbar">	<div class="navbar-inner">		<div class="left">			<a ng-click="closeLibrary()" class="back">Done</a>		</div>		<div class="center">Photo Library</div>	</div></div>	<div ng-controller="PhotoAlbumCtrl as vm" class="content-block">		<div style="display: inline; position: relative;" 					ng-repeat="item in thumbnails | orderBy: \'-creationDate\' | limitTo: thumbnailLimit track by item.id">			<img ng-click="markSelected(item)" 						width="75" 						style="display: inline; position: relative;" 						id="{{item.id}}" 						ng-src="{{item.thumbnailURL}}" />			<i ng-if="isSelected(item.id)" 					class="f7-icons color-blue" 					style="position: absolute; top: -4px; right: 4px; display:inline; font-size: 20px; background-color: white; border-radius: 100%;">						check_round_fill				</i>		</div>		<div class="infinite-scroll-preloader">			<div class="preloader">				</div>		</div>	</div></div>';
				
				//$$('#open-library-template').append(libraryPopupTemplate);
				//var newContent = angular.element(document.getElementById('open-library-template'));
			//$compile(newContent)($scope);
			//$scope.$apply();
				
				getPhotoLibrary();
				
				
				//setTimeout(function(){
				PhotoDash.fw7.app.popup('.popup-library', true, true);
				//}, 700);
			
			}
		}];
		
		var cancelButton = [{
			text: 'Cancel',
			bold: true,
			isCancel: true,
			onClick: function(){
				console.log('cancelled photo action');
				//PhotoDash.fw7.app.closeModal('#popupsettings', true);
			}
		}];
		
		PhotoDash.fw7.app.actions([cameraButtons, cancelButton]);
		//mainView.router.loadPage('photo-album.html');
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
	
	vm.clearPhotos = function(albumName){ 
	   PhotoDash.fw7.app.swipeoutDelete('#' + albumName, function(){
			vm.albums = selectionService.removePhotoAlbum(albumName);
	   });
	    
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
	
	vm.selectAlbum = function(albumName){
		
		selectionService.setActivePhotoAlbum(albumName);
		//var activeAlbum = selectionService.getActivePhotoAlbum();
		//$scope.thumbnails = activeAlbum.libraryItems;
		//PhotoDash.fw7.app.popup('.popup-library');
		
		
		setTimeout(function(){
			mainView.router.loadPage('album-review.html'); 
		}, 200);
	};
	
	var ulElExists = false;
	
	vm.init = function(){ 
		vm.albums = selectionService.getPhotoAlbums();
		/*if (!ulElExists &&  vm.albums.length > 0){
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
				console.log('adding album ---> ' + vm.albums[i].albumName);
			
				var viewAlbumTemplate = '<li class="swipeout"><div class="swipeout-content"><a ng-click="vm.selectAlbum(\'' + vm.albums[i].albumName + '\')" class="item-content item-link"><div class="item-media"><img src="' + vm.albums[i].libraryItems[0].thumbnailURL + '" width="50" /></div><div class="item-inner" style="width: 100%;"><div class="item-title-row"><div class="item-title"><div ng-bind="vm.albums[' + i + '].albumName"></div></div><div class="item-after">(<div ng-bind="vm.albums[' + i + '].libraryItems.length"></div>)</div></div></div></a></div><div class="swipeout-actions-left"><a class="bg-green action1" ng-click="vm.submitPhotos(\'' + vm.albums[i].albumName + '\')">Send</a><a href="photo-album.html" class="bg-lightblue action2">Add</a></div><div class="swipeout-actions-right"><a ng-click="vm.clearPhotos('+ vm.albums[i].albumName + ')" class="swipeout-delete action3">Delete</a></div></li>';
					
				$$('#photo-html-placeholder').append(viewAlbumTemplate);

				var newContent = angular.element(document.getElementById('photo-html-placeholder'));
				$compile(newContent)($scope);
				
				$scope.$apply();
			}
		}*/
	};

	vm.init();
	
	
	$$('.infinite-scroll').on('infinite', function () {
              console.log('INFINITE SCROLLING....................................');
				if (loading) return;
				loading = true;
                
				if ($scope.thumbnailLimit >= $scope.thumbnails.length) {
					// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
					PhotoDash.fw7.app.detachInfiniteScroll($$('.infinite-scroll'));
					// Remove preloader
					$$('.infinite-scroll-preloader').remove();
					return;
				}
			
			setTimeout(function(){
				$scope.thumbnailLimit += itemsPerLoad;
              //  $root$scope.$emit('lazyImg:refresh');
				//$scope.$apply();
				loading = false;
				$scope.$apply();
                
                }, 200);
			});
}]);