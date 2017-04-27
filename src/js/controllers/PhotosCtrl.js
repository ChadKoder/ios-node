PhotoDash.angular.controller('PhotosCtrl', ['$scope', '$rootScope', '$http', 'photoAlbumService', 'authService', 
function($scope, $rootScope, $http,  photoAlbumService, authService) {
	var vm = this;
	
	vm.username = '';
	vm.password = '';
	vm.popupSettingsName = 'popup-settings';
	vm.popupLibraryName = 'popup-library';
	vm.popupAlbumName = 'popup-album';
	
	vm.albumItems = [];
	$scope.activeAlbum = {};
	
	vm.albums = [];
	var currIndex = 0;
	
	var photoAlbumForm = new FormData();
	photoAlbumForm.enctype = 'multipart/form-data';
		
	vm.selectAlbum = function(albumName){
		$scope.allItems = {};
		
		PhotoDash.fw7.app.popup('.' + vm.popupAlbumName, true, true);
		
		setTimeout(function(){			
			selectedAlbum = _.findWhere(vm.albums, { name: albumName });
			$scope.allItems.name = selectedAlbum.name;
			$scope.allItems.libraryItems = selectedAlbum.libraryItems; 
			$scope.$apply();
		}, 800);		 
	};
	
	vm.showPreloader = function(msg){
		PhotoDash.fw7.app.showPreloader(msg);
	};
	
	vm.hidePreloader = function(){
		PhotoDash.fw7.app.hidePreloader();
	};
	
	$scope.closePopup = function(){
		PhotoDash.fw7.app.closeModal();
	};
	
	/*
	var getPicture = function(){
		PhotoDash.fw7.app.alert('Take Photo is not implemented!');
		return;
		navigator.camera.getPicture(onSuccess, onFail, { quality: 100,
			destinationType: Camera.DestinationType.FILE_URI });

		function onSuccess(imageURI) { 
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
	};*/
	
	vm.openSettings = function(){
		console.log('attempting to open settings popup...');
		setTimeout(function(){
			PhotoDash.fw7.app.popup('.' + vm.popupSettingsName, true, true);
		}, 800);
	};
	
	vm.closePopupLibrary = function(){		
		var albumName;
		
		if (vm.selectedAlbumName){
			albumName = vm.selectedAlbumName;
		} else {
			albumName = vm.settings.albumName;
		}
		
		if (vm.albumItems.length > 0){
			
			var existingAlbum = _.findWhere(vm.albums, {name: albumName });
						
			if (existingAlbum){
				photoAlbumService.updateAlbum(albumName, vm.albumItems);
				
			} else {
				 photoAlbumService.createAlbum(albumName, vm.albumItems);				
			}			
		}
		
		PhotoDash.fw7.app.closeModal();
				
	};
	
	vm.openPhotoLibrary = function(albumName){

		vm.selectedAlbumName = albumName;
		
		var cameraButtons = [{
			text: 'Take Photo',
			isCapturePhoto: true,
			color: 'black',
			onClick: function(){
				PhotoDash.fw7.app.closeModal();
				getPicture();
			}
		},
		{
			text: 'Photo Library',
			isLibrary: true,
			color: 'black',
			onClick: function(){								
				PhotoDash.fw7.app.closeModal();
				setTimeout(function(){
					PhotoDash.fw7.app.popup('.' + vm.popupLibraryName, true, true);
				}, 800);
			
			}
		}];
		
		var cancelButton = [{
			text: 'Cancel',
			bold: true,
			isCancel: true,
			onClick: function(){
				console.log('cancelled photo action');
			}
		}];
		
		PhotoDash.fw7.app.actions([cameraButtons, cancelButton]);
	};
	
	
	vm.createFilesAndSubmit = function(albumName){
		$http.defaults.headers.common.Authorization = authService.getAuthHeader(vm.settings.username, vm.settings.password);

		var selectedAlbum = photoAlbumService.getAlbum(albumName);
		
		console.log('attempting to submit items for album: ' + selectedAlbum.name);
		console.log('total in album: ' + selectedAlbum.libraryItems.length);
		
		var selectedItems = selectedAlbum.libraryItems;

		var sendCtr = 0;
		
		var createAndSendPhotos = function(currIndex){
				cordova.plugins.photoLibrary.getPhoto(selectedItems[currIndex].id, function(photo){
						var form = new FormData();
						form.enctype = 'multipart/form-data';
						form.append('file', photo, selectedItems[currIndex].fileName);
						
						var url = 'http://192.168.1.109:8888/files?albumName=' + selectedAlbum.name + '&uploadDir=' + vm.settings.uploadDir;
						
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
			photoAlbumService.removeAlbum(albumName);
	   });
	    
	};

	vm.submitPhotos = function(albumName){
		vm.showPreloader('Submitting album: ' + albumName);
		vm.createFilesAndSubmit(albumName);
	};
	
	vm.init = function(){ 
		vm.albums = photoAlbumService.getAlbums();
	};

	vm.init();
	
}]);
