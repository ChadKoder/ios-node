angular.module('dash-client').directive('fileInput', ['$q', '$compile', '$timeout','$templateRequest', '$compile', '$location', 
	function ($q, $compile, $timeout,$compile, $templateRequest, $location) {
		return {
			restrict: 'E',
			scope: {
				selectedPhotos: '=?',
				selectedVideos: '=?',
				inputType: '='
			},
			link: function (scope, element, attrs, ctrl) {
				scope.selectedPhotos = [];
				scope.selectedVideos = [];
				scope.fullScreenObj = null;
				scope.selectedMediaType = 'image';
				scope.selectedMediaTypeText = 'images';
				scope.templateLoaded = false;
				
				var readSelectedFile = function (file, index){
					readAsDataURL(file).then(function(result) {
						var selectedFile = file;
						var fileName = file.name + '_' + index;
						var fileType = file.type;

						var dataUrl = window.URL.createObjectURL(file);
						//var img = new Image();
						//img.src = dataUrl;
						//var fileObj = {};
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
				
				scope.onFileChange = function (e) {
					var selectedFiles = e.target.files;
					scope.totalFiles = selectedFiles.length;

					for (var i = 0; i < selectedFiles.length; i++){
						var file = selectedFiles[i];
						setTimeout(readSelectedFile(file, i), i * 100);
					}
				};
				
				$timeout(function(){
					var inputElement;
					if (scope.inputType === 'image'){
						inputElement = angular.element(element[0].querySelector('#imageInput'));
						inputElement.bind('change', scope.onFileChange);
						scope.$apply();
						return;
					}
					if (scope.inputType === 'video'){
						inputElement = angular.element(element[0].querySelector('#videoInput'));
						inputElement.bind('change', scope.onFileChange);
						scope.$apply();
						return;
					}
				}, 900);
				
				scope.getContentUrl = function(){
					if (scope.inputType === 'image'){
						return './views/image-input.html';
					}
					if (scope.inputType === 'video'){
						return './views/video-input.html';
					}
				};

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

						var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, scope.items, options);

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
			},
			template: '<div ng-include="getContentUrl()"></div>'
		}
}]);