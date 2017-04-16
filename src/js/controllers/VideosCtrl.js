PhotoDash.angular.controller('VideosCtrl', ['$q', '$scope', '$rootScope', '$http', 'videoAlbumService', '_',
function($q, $scope, $rootScope, $http, videoAlbumService, _) {
	var vm = this;
	
	var activeAlbumName = '';
	vm.albums = [];
	
	vm.username = 'chad';
	vm.password = 'pass';
				
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
	
	vm.removeAlbum = function(albumName){ 
		PhotoDash.fw7.app.swipeoutDelete('#' + albumName, function(){			
			var removeMe = _.findWhere(vm.albums, { name: albumName });			
			vm.albums = _.without(vm.albums, removeMe);
	   });
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
		var file = this.files[0];
		
		var existingAlbum = _.findWhere(vm.albums, { name: activeAlbumName });
		
		if (existingAlbum){
			videoAlbumService.addItem(existingAlbum.name, file);
		} else {
			videoAlbumService.createAlbum(activeAlbumName, file, function(newAlbum){
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
	
	vm.removeAlbum = function(albumName){ 
	   PhotoDash.fw7.app.swipeoutDelete('#' + albumName, function(){			
			videoAlbumService.removeAlbum(albumName);
	   });
	    
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
	
	vm.submit = function(albumName){
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
	
	var init = function(){
		vm.albums = videoAlbumService.getAlbums();
	};
	
	
}]);
