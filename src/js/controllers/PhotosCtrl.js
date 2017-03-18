PhotoDash.angular.controller('PhotosCtrl', ['$q', '$scope', '$rootScope','$compile', '$http', 'selectionService', 
function($q, $scope, $rootScope, $compile, $http, selectionService) {
	var vm = this;
	vm.totalPhotos = 0;
	vm.username = 'chad';
	vm.password = 'pass';
	vm.thumbnail = null;
	vm.selectedPhotos = [];
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
	
	vm.createFilesAndSubmit = function(){
	var encodedAuth = btoa(vm.username + ':' + vm.password);
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
	
		selectedItems = selectionService.getPhotos();
		
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
												
						$http.post('http://192.168.1.109:8888' + '/files', form, {
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
	  photoAlbumExists = false;
	    vm.selectedPhotos = [];
	    selectionService.clearPhotos();
	};

	vm.submitPhotos = function(){
		vm.showPreloader('Submitting album to your PC...');
		vm.createFilesAndSubmit();
	};

	vm.init = function(){ 
		vm.selectedPhotos = selectionService.getPhotos();
		
		if (vm.selectedPhotos.length > 0){
			 photoAlbumExists = true;
			vm.thumbnail = vm.selectedPhotos[0].thumbnailURL;
			var viewAlbumTemplate = '<li class="swipeout"><div class="swipeout-content"><a ng-href="album-review.html" class="item-content"><div class="item-media"><img ng-src="{{vm.thumbnail}}" width="50"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">Photo Album</div><div class="item-after">({{vm.selectedPhotos.length}})</div></div><div class="item-subtitle">Review your photos</div></div></a></div><div class="swipeout-actions-left"><a class="bg-lightblue action3" ng-click="vm.submitPhotos()">Send</a></div><div class="swipeout-actions-right"><a ng-click="vm.clearPhotos()" class="swipeout-delete action4">Delete</a></div></li>';

			$$('#photo-html-placeholder').append(viewAlbumTemplate);

			var newContent = angular.element(document.getElementById('photo-html-placeholder'));
			$compile(newContent)($scope);
			$scope.$apply();
		}
	};

	vm.init();
}]);
