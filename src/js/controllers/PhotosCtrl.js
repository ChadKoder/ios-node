angular.module('dash-client')
.controller('PhotosCtrl', ['$http', '$mdToast', '$scope', '_',
	function ($http, $mdToast, $scope, _) {
	var port = ':8888';
	var vm = this;
	vm.ipAddress = '';
	vm.username = '';
	vm.password = '';
	vm.uploadDir = '';
	vm.photos = [];
	
    vm.getInfo = function(){
        alert('get info!');
    }

	vm.getSettings = function (){
		var localStorage = window.localStorage;
		
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
    
    vm.clearAlbum = function(){
        vm.photos = [];
    }

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
     
    /* vm.scaleDownImage = function (w, h){
         var newDimensions = {};
         var maxWidth = 1000;
         var maxHeight = 1000;
         var ratio = 0;
         var width = w;
         var height = h;
         console.log(' scalling down... width > max? ' + width + ' ' + maxWidth);
         if (width > maxWidth){
             //ratio = maxWidth / width;
             newDimensions.height = height * (maxWidth / width);
             newDimensions.width = maxWidth;
             
         }
         console.log('scale down height? height' + ' ' + height + ' max: ' + maxHeight);
         if (height > maxHeight){
             newDimensions.width = maxWidth *(maxHeight / newDimensions.height);
             newDimensions.height = maxHeight;
         }
         
         console.log('new width: ' + newDimensions.width + ' ew Height: ' + newDimensions.height);
         
         return newDimensions;
     
     };*/
     
     vm.getOptions = function(items){
           // define options (if needed)
           var options = {
               //index: index,
               //   arrowEl: true,
               // tapToToggleControls: true,
               history: false,
               loop: true,
               timeToIdle: 4000,
               showHideOpacity: false,
               hideAnimationDuration: 333,
               bgOpacity: 1,
               spacing: 0.12,
               allowPanToNext: true,
               maxSpreadZoom: 2,
               pinchToClose: true,
               closeOnScroll: false,
               closeOnVerticalDrag: true,
               mouseUsed: false,
               escKey: false,
               arrowKeys: false,
               galleryPIDs: true,
               preload: [1,1],
               mainClass: "testClass1",
               focus: true,
               isClickableElement: function (el){
                   return false;
               },
               modal: true,
               
               // getNumItemsFn
               // getDoubleTapZoon
               barsSize: {top:55, bottom: 'auto'},
               timeToIdleOutside: 1000,
               loadingIndicatorDelay: 1000,
               addCaptionHTMLFn: function (item, captionEl, isFake){
                   captionEl.children[0].innerHTML = 'Caption Test1';
                   return true;
               },
               closeEl: true,
               captionEl: true,
               fullscreenEl: true,
               zoomEl: true,
               shareEl: false,
               counterEl: true,
               arrowEl: true,
               preloaderEl: true,
               tapToClose: false,
               tapToToggleControls: true,
               clickToCloseNonZoomable: false,
               closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'],
               indexIndicatorSep: '/',
               
               getThumbBoundsFn: function(index){
                    var thumbnail = items[index].el;
                    var rect = thumbnail.getBoundingClientRect();
                    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                   
                    return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
               },
               showAnimationDuration: 2
           };
           
           return options;
                           
       };
       
		vm.getDataFromElements = function(photo, index){
			var returnObj = {
				width: photo.width,
				height: photo.height,
				src: photo.src,
				pid: photo.pid,
				msrc: photo.src
			};
               
			var imageEls = document.querySelectorAll('img');
           
			for (var i = 0; i < imageEls.length; i++){
				var imageEl = imageEls[i];
				var imagepid = imageEl.getAttribute('id');
				if (photo.pid === imagepid){
					returnObj.el = imageEl;
					break;
				}
			}
           
			return returnObj;
       };
					   
		vm.loadPhotoswipe = function(index) {
			var pswpElement = document.querySelectorAll('.pswp')[0];
			var items = [];
			var currIndex = 0;
			var currEl = null;
           
			for (var i = 0; i < vm.photos.length; i++){
				var elementDataObj = vm.getDataFromElements(vm.photos[i], index);
				var origWidth = vm.photos[i].width;
				var origHeight = vm.photos[i].height;

				var item = {
					src: elementDataObj.src,
					msrc: elementDataObj.src,
					pid: elementDataObj.pid,
					el: elementDataObj.el,
					w: origWidth,
					h: origHeight
				};

				if (vm.photos[i].orientation === 6){
					if (parseInt(origWidth) > parseInt(origHeight)){
						item.w = origHeight;
						item.h = origWidth;
					}
				}

				items.push(item);
            }
            
			for (var g = 0; g < items.length; g++){
				if (items[g].pid === index){
				  currIndex = g;
				  break;
				}
			}
            
			var options = vm.getOptions(items);
			options.index = currIndex;

			var gallery = new PhotoSwipe(pswpElement, false, items, options);

           /* gallery.listen('imageLoadComplete', function(index, item){
                console.log('PHOTOSWIPE------> LOADED item of INDEX: ' + index + ' and pid: ' + item.pid);
              });*/
           
           /*TODO: is this needed?*/
			gallery.listen('destroy', function(){
				$scope.$apply();
			});
           
			gallery.init();
	};               
                        
	vm.clear = function(){
		vm.photos = [];
	};
	
	vm.buildPhotoswipeItem = function (photoItem, i, callback){
		var figureEls = document.getElementsByTagName('figure');
		var orientation = photoItem.orientation;

		var item = {
			el: figureEls[i],
			src: photoItem.src,
			msrc: photoItem.src,
			w: photoItem.width,
			h:  photoItem.height,
			pid: 'photo' + i
		};

		if (orientation === 6){
		   if (parseInt(item.w) > parseInt(item.h)){
				item.w = photoItem.height;
				item.h = photoItem.width;
		   }
		}
		
		callback(item);
	};
	
	vm.showSlides = function(){
		vm.showGallery(0);
	}

	vm.showGallery = function(index){
		vm.loadPhotoswipe(index);
	};
	
	vm.getSettings();
	
}]);