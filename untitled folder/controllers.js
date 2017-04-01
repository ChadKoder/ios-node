/*
 * controllers v 1.0.0 (build 20170331_151554_1)
 * 2017
 * Author:  
 */

PhotoDash.angular.controller('AlbumReviewCtrl', ['$scope', '$rootScope', '$compile', 'selectionService', function($scope, $rootScope, $compile, selectionService) {
    var vm = this;
	vm.thumbnailLimit = 60;
	
   vm.init = function(){
		//vm.thumbnails = selectionService.getPhotos();
		var activeAlbum = selectionService.getActiveAlbum();
		vm.thumbnails = activeAlbum.libraryItems;
		$scope.$apply();  
   };
   
    vm.goBack = function(){
        mainView.router.back({url: 'photos.html', force: true});    
    };
   
   vm.init();
   
}]);

PhotoDash.angular.controller('ContactsCtrl', ['$scope', '$compile', '$rootScope', '$http', function($scope, $compile, $rootScope, $http) {
	var vm = this;
	var app = PhotoDash.fw7.app;
	
	vm.contactsSuccess = function(contacts) {
		vm.contacts = contacts;
		$scope.$apply();
	};
	
	vm.uploadContacts = function(){
		app.confirm('Upload ' + vm.contacts.length + ' contacts to your PC? This will overwrite your previous contacts backup.', function (){
			$http.post('http://192.168.1.109:8888' + '/contacts', vm.contacts).then(function (res){
				app.alert('saved contacts to PC successfully!');
			}, function (err){
				app.alert('error saving contacts---> ' + err);
			});
		});
	};
	
	vm.contactsFailure = function(err){
		if (parseInt(err.code) === 20){
			app.alert('Privacy settings are disabled for contacts for this application.');
		}
		app.alert('Error retrieving contacts: ' + err);
	};
	
	vm.getContacts = function(){
		var options = new ContactFindOptions();
		options.filter = '';
		options.multiple = true;
		var filter = ["displayName", "addresses"];
		navigator.contacts.find(filter, vm.contactsSuccess, vm.contactsFailure, options);
	};
	
	vm.init = function(){
		vm.getContacts();
	};
	
	vm.init();
}]);

PhotoDash.angular.controller('MainCtrl', ['$scope', '$compile', '$rootScope', function($scope, $compile, $rootScope) {
	var vm = this;

    $$(document).on('pageAfterAnimation', function(e) {
        console.log('pageAfterAnimation called<--**********');
                 // Send broadcast if a page is left
                 var fromPage = e.detail.page.fromPage;
				 var url = e.detail.page.url; 
				 
				// console.log('remove FROMPAGE or URL?:?? ^^^');
				 console.log('Attempt REMOVE previous page, page ---> ' + fromPage.name);
                 if (fromPage) {
                 //$rootScope.$broadcast(fromPage.name + 'PageLeave', e);
                 if (fromPage.name != 'index') {
                 var prevPage = angular.element(document.querySelector('#'+fromPage.name));
                 prevPage.remove();
                 }
                 }
                 });
				 
				 
				 
				 /*$$(document).on('page:back', function(e){
				 console.log('ON PAGE:BACK <----- e.details.page.name ===> ' + JSON.stringify(e));
					console.log('*****PAGE: BACK!!!!!********');
				 });*/
                                         
        
}]);

PhotoDash.angular.controller('PhotoAlbumCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    var vm = this;
	console.log('LOADED PHOTO ALBUM CONTORLLER ***************');
	var itemsPerLoad = 48;
			$scope.thumbnailLimit = 84;
            $scope.selectedItems = [];
            $scope.totalSelected = 0;
           
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
			
			var cleanup = function(){
				$scope.selectedItems = null;
				$scope.thumbnails = null;
				$scope.totalSelected = null;
				$scope.thumbnailLimit = null;
				console.log('FINISHED CLEANUP....');
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
			
			var init = function(){
				getPhotoLibrary();
			};
			
			$scope.$on('$destroy', function(){
				console.log('my directvie -- $destroy -- cleanup!');
				cleanup();
			});
			
			$scope.getContentUrl = function(){
				return 'photo-library.html';
			};
			
			
           init();
		   
           var loading = false;
		   
			$$('.infinite-scroll').on('infinite', function () {
              
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
	
	/*
    vm.totalPhotos = '';
	vm.totalSelected = 0;
	
       vm.goBack = function(){
			mainView.router.back({url: 'photos.html', force: true});
		};*/
}]);

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
	
	var popupLibEl = document.getElementById('open-library-template');
	
	
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
				var libraryPopupTemplate = '<div id="popuplibrary" class="popup popup-library" style="background-color: #222426; font-size: 12px;">		<div ng-controller="PhotoAlbumCtrl as vm" class="content-block">			<div style="display: inline; position: relative;" 					ng-repeat="item in thumbnails | orderBy: \'-creationDate\' | limitTo: thumbnailLimit track by item.id">				<img ng-click="markSelected(item)" 						width="75" 						style="display: inline; position: relative;" 						id="{{item.id}}" 						ng-src="{{item.thumbnailURL}}" />				<i ng-if="isSelected(item.id)" 					class="f7-icons color-blue" 					style="position: absolute; top: -4px; right: 4px; display:inline; font-size: 20px; background-color: white; border-radius: 100%;">						check_round_fill				</i>			</div>			<div class="infinite-scroll-preloader">				<div class="preloader">				</div>			</div>		</div>	</div>';
				
				
				$$('#open-library-template').append(libraryPopupTemplate);
				var newContent = angular.element(document.getElementById('open-library-template'));
			$compile(newContent)($scope);
			$scope.$apply();
			
			PhotoDash.fw7.app.popup('.popup-library');
			
			
			/*if (popupLibEl){
			   console.log('GOT ELL ****************************');
			   popupLibEl.click();
			} else {
			 console.log('************************NO EL TO CLICKL!!!!!!!!******');
			}*/
			
			 
			
			
				//PhotoDash.fw7.app.popup(libraryPopupTemplate, true, true);
			//	$scope.$apply();
				//mainView.router.loadPage('photo-album.html');
				//PhotoDash.fw7.app.alert('Temp select from library click!');
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
	
	vm.clearPhotos = function(albumName){
	  //photoAlbumExists = false;
	   
	    vm.albums = selectionService.removePhotoAlbum(albumName);
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
}]);
PhotoDash.angular.controller('SettingsCtrl', function() {
	var vm = this;
	vm.saveSettings = function (){
		 var credentials = btoa(vm.username + ':' + vm.password);
		 var localStorage = window.localStorage;
		 var settings = {
			 ipAddress: vm.ipAddress,
			 //	deviceName: vm.deviceName,
			 accountId: vm.accountId,
			 credentials: credentials,
			 uploadDir: vm.uploadDir,
			 albumName: vm.albumName
		 }
		 
		localStorage.setItem('accountId', vm.accountId);
		localStorage.setItem('ipAddress', vm.ipAddress);
		localStorage.setItem('credentials', credentials);
		localStorage.setItem('uploadDir', vm.uploadDir);
		localStorage.setItem('albumName', vm.albumName);
		 alert('saved settings to local storage!');
		/* httpService.post('/settings', credentials, settings)
		 .then(function(result) {
			  // vm.inProgress = false;
			   alert('settings saved!');
			   }, function (err) {
			  // vm.inProgress = false;
			   alert('error: ' + JSON.stringify(err));
			   });*/
		 // alert('1111');
		  // ngModel.saveSettings();
		 // this.saveSettings();
	 
	};
	
	vm.getSettings = function (){
		var localStorage = window.localStorage;

		vm.ipAddress = localStorage.getItem('ipAddress');
		var creds = localStorage.getItem('credentials');
		vm.uploadDir = localStorage.getItem('uploadDir');
		vm.albumName = localStorage.getItem('albumName');
		var credString = atob(creds);
		//alert('credsString: ' + credString);
		var credsSplit = credString.split(':');

		if (credsSplit) {
			vm.username = credsSplit[0];
			vm.password = credsSplit[1];
		}
		//alert('settings: ' + settings.ipAddress);
		//return settings;
	};
	
	vm.init = function(){
		
	};

});

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
