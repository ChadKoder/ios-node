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
	
	vm.startSpinner = function(){
		vm.isLoading = true;
	};

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

	vm.isGalleryOpen = false;

	vm.openGallery = function(){
		var galleryEl = document.getElementById('photo-gallery');
		galleryEl.className = 'slide-in';
		vm.isGalleryOpen = true;
	};
	
	vm.gotNextAlready = false;
	vm.maxView = 8;
	vm.incrementBy = 4;
	vm.removeStartTotal = 4;
	vm.currItemRange = { start: 0, end: 0 };//the index range of albums to get for 'paging'
	vm.tempCounter = 0;

	vm.getNextTwelve = function(){
		vm.tempCounter++;
		vm.displayShowMoreIcon = false;
		
		var newStart = vm.photos.length;
		var newEnd = newStart + vm.incrementBy;        
	 
		console.log('newStart first calc: ' + newStart + ' newNed: ' + newEnd);
		if (newEnd > vm.allPhotos.length - 1 && vm.currItemRange.end < vm.allPhotos.length - 1){
			//get remainder of items
			vm.currItemRange.end = vm.allPhotos.length;
			if (newStart > vm.allPhotos.length - 1 && vm.currItemRange.start < vm.allPhotos.length - 1){
				var diff = vm.allPhotos.length - vm.currItemRange.start;
				vm.currItemRange.start = vm.allPhotos.length - diff - 1;
			}  else {
				vm.currItemRange.start = newStart;
			}
		} else {
			if (newStart <= vm.allPhotos.length - 1 && newEnd <= vm.allPhotos.length - 1){
				console.log('normal increment... new range START: '  + newStart +  ' END: ' + newEnd);
				vm.currItemRange.start = newStart;
				vm.currItemRange.end = newEnd;
			} else {
				console.log('End of album?? newStart :' + newStart + ' newEnd: ' + newEnd + ' vm.allPhotos.length : ' + vm.allPhotos.length);
				console.log('DONE.. END OF ALBUM....');
				return;
			}
		}
        
		console.log('LOOPING through to add total of ==> ' + (vm.currItemRange.end - vm.currItemRange.start)
		 + ' items of total ALLPHOTOS LENGTH0-00-----> ' + vm.allPhotos.length);
		for (var i = vm.currItemRange.start; i < vm.currItemRange.end; i++){
			console.log('ADDING FROM INDEX: ' + i);
			var nextPhoto = vm.allPhotos[i];

			var viewWidth = nextPhoto.width;
			var viewHeight = nextPhoto.height;

			var newSize = vm.scaleSize(nextPhoto.width, nextPhoto.height, nextPhoto.orientation);

			viewWidth = newSize[0];
			viewHeight = newSize[1];
			if (nextPhoto.orientation == 6){
				if (newSize[0] > newSize[1]){
					viewWidth = newSize[1];
					viewHeight = newSize[0];
				}
			}

			var style = { 'width': viewWidth + 'px', 'height': viewHeight + 'px', 'position': 'absolute',
			'left': '50%', 'top': '50%', '-webkit-transform': 'translate(-50%, -50%)'};		  

			vm.styles.push(style);
			vm.photos.push(nextPhoto);
		}
	};
	
	vm.getAmountScrolled = function (){
		var winheight= window.innerHeight || (document.documentElement || document.body).clientHeight;
		var docheight = vm.getDocHeight();
		var scrollTop = vm.albumEl.scrollTop;
		var trackLength = docheight - winheight;
		var pctScrolled = Math.floor(scrollTop/trackLength * 100); // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
		//console.log(pctScrolled + '% scrolled');
		
		if (pctScrolled >= 95){
			if (!vm.displayShowMoreIcon) {
				console.log('showing more button..;');
				vm.displayShowMoreIcon = true;
				$scope.$apply();
			}

			} else {
			if (vm.displayShowMoreIcon){
				console.log('hiding more button');
				vm.displayShowMoreIcon = false;
				$scope.$apply();
			}
		}
	};
	
	vm.isScrollEventAdded = false;
	vm.displayShowMoreIcon = false;
	
	vm.albumEl = null;
		
    vm.checkScrollPosition = function(event){
		if (vm.albumEl.scrollHeight == vm.albumEl.scrollTop + window.innerHeight){
			alert('at the bottom!');
		}
	};
	
	vm.closeGallery = function(){
		var galleryEl = document.getElementById('photo-gallery');
		galleryEl.className = 'slide-out';
		vm.isGalleryOpen = false;
		vm.displayShowMoreIcon = false;
	};

	vm.submit = function (){
		if (!vm.username || !vm.password) {
			vm.showErrorToast('username and password are required.');
			return;
		}

		var encodedAuth = btoa(vm.username + ':' + vm.password);
		var formData = new FormData();
		formData.enctype = "multipart/form-data";

		angular.forEach(vm.allPhotos, function (obj) {
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
	
	vm.getDocHeight = function() {
		var D = document;
		return Math.max(
			vm.albumEl.scrollHeight, D.documentElement.scrollHeight,
			vm.albumEl.offsetHeight, D.documentElement.offsetHeight,
			vm.albumEl.clientHeight, D.documentElement.clientHeight);
	};
	
	vm.allPhotos = [];

	vm.scaleSize = function(width, height, orientation){
		var ratio = height / width;

		var screenWidth = document.getElementById('scrollArea').offsetWidth;

		var maxWidth = 155;
		var maxHeight = 155;

		if (width >= maxWidth && ratio <= 1){
			width = maxWidth;
			height = width * ratio;

		} else if(height > maxHeight) {
			height = maxHeight;
			width = height / ratio;
		}

		return [width, height];
		   
	};
	
	vm.styles = [];
    
	if (!vm.isScrollEventAdded){
		console.log('adding scroll event...');
		vm.albumEl = document.getElementById('scrollArea');
		vm.albumEl.addEventListener('scroll', vm.getAmountScrolled);
		vm.isScrollEventAdded = true;
	}
					   
   vm.onPhotoLoaded = function (photo){
        var origHeight = photo.height;
        var origWidth = photo.width;
        
        var viewWidth = photo.width;
        var viewHeight = photo.height;
        
        var newSize = vm.scaleSize(photo.width, photo.height, photo.orientation);
        viewWidth = newSize[0];
        viewHeight = newSize[1];
       
		if (photo.orientation == 6){
			if (viewWidth > viewHeight){
				viewWidth = newSize[1];
				viewHeight = newSize[0];
			}
		}
		
		var style = { 'width': viewWidth + 'px', 'height': viewHeight + 'px', 'position': 'absolute',
			'left': '50%', 'top': '50%', '-webkit-transform': 'translate(-50%, -50%)'};

		vm.styles.push(style);
		photo.width = viewWidth;
		photo.height = viewHeight;
		photo.origWidth = origWidth;
		photo.origHeight = origHeight;

		if (vm.photos.length < vm.maxView){
			vm.photos.push(photo);
		}

		console.log('adding photo pid: ' + photo.pid + ' and fileName: ' + photo.fileName);
		
		vm.allPhotos.push(photo);
	};

	vm.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
	};

	vm.scaleDownImage = function (w, h){
		var newDimensions = {};
		var maxWidth = 240;
		var maxHeight = 240;
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

		return newDimensions;
	};

	vm.getOptions = function(items){
		var options = {
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
			var origWidth = vm.photos[i].origWidth;
			var origHeight = vm.photos[i].origHeight;

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

	   gallery.listen('imageLoadComplete', function(index, item){
			console.log('PHOTOSWIPE------> LOADED item of INDEX: ' + index + ' and pid: ' + item.pid);
		  });
	   
	   /*TODO: is this needed?*/
		gallery.listen('destroy', function(){
			$scope.$apply();
		});
	   
		gallery.init();
	};
                        
	vm.clear = function(){
		vm.photos = [];
        vm.allPhotos = [];
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
