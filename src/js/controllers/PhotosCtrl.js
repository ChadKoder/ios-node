angular.module('dash-client')
.controller('PhotosCtrl', ['$http', '$mdToast', '$scope', '_',
	function ($http, $mdToast, $scope, _) {
	var port = ':8888';
	var vm = this;
	vm.ipAddress = '';
	vm.username = '';
	vm.password = '';
	vm.uploadDir = ''; 
    $scope.items = [];
    vm.photos = [];
    $scope.testitems = [];
    vm.totalRestored = 0;
    
    $scope.$watch('items.length', function() {
        if($scope.items.length === vm.photos.length){
        }
    });
	
    $scope.$watch('vm.photos.length', function(i) {
        //if (i){
            
                  //alert(i);
                  //alert('test i : ' + i);
                  // alert('MAINCTRL! ' + vm.photos.length);
                  //var fr = new FileReader;
                  //fr.onload = function() {
                  
                  //alert(vm.photos.length);
                  
                  for (var y=0; y < vm.photos.length; y++){
                  
                      var img = new Image;
                      
                      img.src = vm.photos[y].dataUrl;
                      
                      img.onload = function() {
                          //alert(img.width);
                          
                          // alert('scope photos: ' + i);
                          var item = {
                              src: img.src,
                              //w: img.width,
                              //h: img.height,
                              pid: 'photo' + Math.random()
                          };
                          
                          $scope.items.push(item);
                          
                      };

                  }
                                  
                  // img.src = $scope.photos[i].dataUrl;
                  
                  
           // }
       
                  });
                  
                  
   // var originatorEvent;
    
    vm.getInfo = function(){
        alert('get info!');
    }

	vm.getSettings = function (){
		var localStorage = window.localStorage;
		//vm.deviceName = localStorage.getItem('deviceName');
		
		/*if (!vm.deviceName){
			alert('Enter a device name to continue...');
			return;
		}		*/
		
		vm.uploadDir = localStorage.getItem('uploadDir');
		vm.albumName = localStorage.getItem('albumName');
		vm.ipAddress = localStorage.getItem('ipAddress');
		var cred = localStorage.getItem('credentials');
		var credString = atob(cred);
		var creds = credString.split(':');
		vm.username = creds[0];
		vm.password = creds[1];

		if (vm.ipAddress && vm.username && vm.password) {
			vm.serverSettings = true;
			vm.editSettingsText = 'Edit';
		} else {
			vm.serverSettings = false;
			vm.editSettingsText = 'Show';
		}
	};

	vm.showErrorToast = function (err) {
		vm.showSimpleToast(err);
	};

	vm.showSuccessToast = function (msg) {
		vm.showSimpleToast(msg);
	};	
   
	vm.submit = function (){
		if (!vm.username || !vm.password) {
			vm.showErrorToast('username and password are required.');
			return;
		}

		var encodedAuth = btoa(vm.username + ':' + vm.password);
		var formData = new FormData();
		formData.enctype = "multipart/form-data";

		angular.forEach(vm.photos, function (obj) {
			formData.append('file', obj.file);
		});
		
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
		vm.inProgress = true;

		$http.post(vm.ipAddress + port + '/files', formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
			}).then(function(result) {
				vm.inProgress = false;
				vm.showSuccessToast('Album upload successful!');
			}, function (err) {
				alert('err: ' + JSON.stringify(err));
				var errorStatus = err.status.toString().trim();
				vm.inProgress = false;
				switch (errorStatus) {
					case '401':
						vm.showErrorToast('username/password validate failed.');
						vm.username = '';
						vm.password = '';
						break;
					case '-1':
						vm.showErrorToast('Server is not available.');
						break;
					default:
						vm.showErrorToast('Unknown error.');
						break;
				}
		});
	};

	vm.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
	};
	
	
	vm.showGallery = function (fileName){
		var imgIndex = 0;
		for (var i = 0; i < vm.photos.length; i++){
			if (fileName === vm.photos[i].fileName){
				imgIndex = i;
			}

		}
		
		require([
		'./js/photoswipe.js',
		'./js/photoswipe-ui-default.js'
		], function(PhotoSwipe, PhotoSwipeUI_Default) {
			var pswpElement = document.querySelectorAll('.pswp')[0];

			// define options (if needed)
			var options = {
				// history & focus options are disabled on CodePen
				index: imgIndex,
				history: false,
				barsSize: {top:250, bottom: 'auto'},
				focus: false,
				//fullscreenEl: false,
				showAnimationDuration: 2,
				hideAnimationDuration: 2,
				addCaptionHTMLFn: function (item, captionEl, isFake) {
					if (!item.title){
						captionEl.children[0].innerHTML = 'no title';
						return false;
					}
					captionEl.children[0].innerHTML = item.title;
					return true;
				},
				closeEl: true,
				captionEl: true,
				zoomEl: true,
				getDoubleTapZoom: function(isMouseClick, item) {
					if(isMouseClick) {
						return 1;
					} else {
						return item.initialZoomLevel < 0.7 ? 1 : 1.5;
					}
				}
			};

			var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, $scope.items, options);

			gallery.listen('gettingData', function(index, item) {
				if (item.w < 1 || item.h < 1) { // unknown size
					var img = new Image();
					img.onload = function() { // will get size after load
						item.w= this.width;
						item.h = this.height;
						//item.title = ' TITLE YO!';
						gallery.invalidateCurrItems(); // reinit Items
						gallery.updateSize(true); // reinit Items
					}
					img.src = item.src; // let's download image
				}

				//alert('w: ' + item.w + ' h: ' + item.h);
			});

			/*  gallery.listen('imageLoadComplete', function(index, item) {
			var linkEl = item.el.children[0];
			var img = item.container.children[0];
			if (!linkEl.getAttribute('data-size')) {
			linkEl.setAttribute('data-size', img.naturalWidth + 'x' + img.naturalHeight);
			item.w = img.naturalWidth;
			item.h = img.naturalHeight;
			gallery.invalidateCurrItems();
			gallery.updateSize(true);
			}
			});*/

			gallery.init();

			});

	};

	vm.getSettings();

}]);