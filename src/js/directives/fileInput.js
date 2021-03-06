angular.module('dash-client').directive('fileInput', ['$q', '$compile', '$timeout', function ($q, $compile, $timeout) {
	return {
		restrict: 'E',
		templateUrl: './views/file-input.html',
		replace: false,
		scope: {
		selectedPhotos: '=?',
		selectedVideos: '=?'
		},
		link: function (scope, element, attrs, ctrl) {
		scope.selectedPhotos = [];
		scope.selectedVideos = [];
		//scope[attrs.ngModel] = scope.selectedPhotos;
		scope.fullScreenObj = null;
		scope.selectedMediaType = 'image';
		scope.selectedMediaTypeText = 'images';

		/*scope.viewImage = function (fileName) {
		require([
		'./js/photoswipe.js',
		'./js/photoswipe-ui-default.js'
		], function( PhotoSwipe, PhotoSwipeUI_Default ) {
		var pswpElement = document.querySelectorAll('.pswp')[0];

		scope.items = [];

		for (var i = 0; i < scope.selectedPhotos.length; i++){

		//var fr = new FileReader;
		//fr.onload = function() {
		var img = new Image;
		img.onload = function() {
		//  alert(img.width);
		alert('scope photos: ' + i);
		var item = {
		src: scope.selectedPhotos[i].dataUrl,
		w: 640,
		h: 1136,
		pid: 'photo' + i
		};

		scope.items.push(item);

		};

		img.src = scope.selectedPhotos[i].dataUrl;

		}

		// define options (if needed)
		var options = {
		// history & focus options are disabled on CodePen
		index: 0,
		history: false,
		barsSize: {top:15, bottom:350},
		focus: false,
		//fullscreenEl: false,
		showAnimationDuration: 0,
		hideAnimationDuration: 0,
		addCaptionHTMLFn: function (item, captionEl, isFake) {
		if (!item.title){
		captionEl.children[0].innerHTML = '';
		return false;
		}

		//    captionEl.children[0].innerHTML = item.title;

		captionEl.children[0].innerHTML = 'BLAH!';
		return true;
		},
		closeEl: true,
		captionEl: true,
		zoomEl: true

		};

		var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();

		});
		}; */

		if (attrs.disptext){
		scope.buttonText = attrs.disptext;
		}

		var elImageInput = angular.element(element[0].querySelector('#imageInput'));
		var elVideoInput = angular.element(element[0].querySelector('#videoInput'));

		var readAsDataURL = function (file, index) {
		var deferred = $q.defer();
		var reader = new FileReader();  
		reader.onloadstart = function () {
		deferred.notify(0);
		};

		reader.onload = function (e) {
		};

		reader.onloadend = function (e) {
		deferred.resolve({
		'index': index,
		'result': reader.result
		});  
		};

		reader.onerror = function (e) {
		alert('Error occurred while reading file!');
		// deferred.reject(reader.result);
		// var errorCode = e.target.error.code;
		};

		reader.readAsArrayBuffer(file);
		return deferred.promise;
		};

		/* scope.$watch('items.length', function() {
		alert('newVal: ' + scope.items.length);
		if (scope.items.length === scope.selectedPhotos.length){
		alert('got em!');
		}
		});*/

		var readSelectedFile = function (file, index){
		readAsDataURL(file).then(function(result) {
		var selectedFile = file;
		var fileName = file.name + '_' + index;
		var fileType = file.type;

		var dataUrl = window.URL.createObjectURL(file);
		//var img = new Image();
		//img.src = dataUrl;
		var fileObj = {};
		var fileObj = {
		file: selectedFile,
		fileName: fileName,
		fileType: fileType,
		dataUrl: dataUrl
		};

		scope.closeFullScreen = function () {
		scope.fullScreenObj = null;
		}

		if (fileType === 'image/jpeg' || fileType === 'image/png') {
		scope.selectedPhotos.push(fileObj);
		} else if(fileType === 'video' || fileType === 'video/quicktime'){
		scope.selectedVideos.push(fileObj);
		}

		}, function(error){
		alert('error: ' + error);
		}, function (notify) {
		});
		};

		scope.refresh = function () {
		if (!scope.$$phase) {
		scope.$apply();
		}
		};

		scope.clearAll = function () {
		scope.selectedPhotos = [];
		scope.selectedVideos = [];
		}

		scope.items = [];

		scope.$watch('items.length', function() {
		if (scope.items.length === scope.selectedPhotos.length){
		}
		});

		scope.showGallery = function (fileName){
		var imgIndex = 0;
		for (var i = 0; i < scope.selectedPhotos.length; i++){
		if (fileName === scope.selectedPhotos[i].fileName){
		imgIndex = i;
		}

		}
		require([
		'./js/photoswipe.js',
		'./js/photoswipe-ui-default.js'
		], function(PhotoSwipe, PhotoSwipeUI_Default) {
		var pswpElement = document.querySelectorAll('.pswp')[0];

		/*var items = [];

		for (var i = 0; i < vm.photos.length; i++){
		var item = {
		src:vm.photos[i].dataUrl,
		w: 640,
		h: 1136,
		pid: 'photo' + i
		};

		items.push(item);

		}*/
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

		//    captionEl.children[0].innerHTML = item.title;

		captionEl.children[0].innerHTML = item.title;
		return true;
		},
		closeEl: true,
		captionEl: true,
		zoomEl: true,
		getDoubleTapZoom: function(isMouseClick, item) {

		// isMouseClick          - true if mouse, false if double-tap
		// item                  - slide object that is zoomed, usually current
		// item.initialZoomLevel - initial scale ratio of image
		//                         e.g. if viewport is 700px and image is 1400px,
		//                              initialZoomLevel will be 0.5

		if(isMouseClick) {

		// is mouse click on image or zoom icon

		// zoom to original
		return 1;

		// e.g. for 1400px image:
		// 0.5 - zooms to 700px
		// 2   - zooms to 2800px

		} else {

			// is double-tap

			// zoom to original if initial zoom is less than 0.7x,
			// otherwise to 1.5x, to make sure that double-tap gesture always zooms image
			return item.initialZoomLevel < 0.7 ? 1 : 1.5;
		}
		}

		};

		var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, scope.items, options);

		gallery.listen('gettingData', function(index, item) {
		if (item.w < 1 || item.h < 1) { // unknown size
		var img = new Image();
		img.onload = function() { // will get size after load
		// alert('w: ' + this.width + ' h: ' + this.height);
		/*  if (this.height > 1136){
		//3264
		item.h = 1136;
		} else {
		item.h = this.height; // set image height
		}

		if (this.width > 640){
		item.w = 640;
		} else {
		item.w = this.width;
		}*/


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

		scope.$watch('selectedPhotos.length', function() {
			if (scope.selectedPhotos.length === scope.totalFiles){
				for (var y=0; y < scope.selectedPhotos.length; y++){

					var img = new Image;
					var item = {
						src: scope.selectedPhotos[y].dataUrl,
						pid: 'photo' + Math.random(),
						w: 0,
						h: 0,
						title: 'my Title!!!!'
					};

					scope.items.push(item);

				}

			}
		});

		scope.onFileChange = function (e) {
		var selectedFiles = e.target.files;

		scope.totalFiles = selectedFiles.length;

		for (var i = 0; i < selectedFiles.length; i++){
		var file = selectedFiles[i];
		setTimeout(readSelectedFile(file, i), i * 100);
		}
		};

		scope.toggleMediaText = function (newVal){
			if (newVal === 'image'){
				scope.selectedMediaTypeText = 'images';
			} else {
				scope.selectedMediaTypeText = 'video';
		}
		}

		elImageInput.bind('change', scope.onFileChange);
		elVideoInput.bind('change', scope.onFileChange);

		}
	}
}]);