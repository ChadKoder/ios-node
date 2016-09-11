//js/directives/fileInput.js
angular.module('dash-client').directive('fileInput', ['$q', '$compile', '$timeout', function ($q, $compile, $timeout) {
	return {
		restrict: 'E',
		template:[
			'<input class="ng-hide fileInput" accept="video/*" id="videoInput" type="file" />',
			'<input class="ng-hide fileInput" accept="image/*" multiple id="imageInput" type="file" />',
			'<div layout="row" layout-align="center center" flex>',
				'<label for="imageInput" md-ink-ripple class="label-button image-input">',
					'Add Photos',
				'</label>',
				'<label for="videoInput" md-ink-ripple class="label-button video-input">',
					'Add&nbsp; Video',
				'</label>',
			'</div>',
			'<md-card flex layout="row" layout-wrap flex="25" id="albumReview" class="album" ng-show="selectedPhotos.length > 0 || selectedVideos.length > 0">',
			'<div class="full-width-label">Total Selected: {{ selectedPhotos.length + selectedVideos.length }}</div>',
			'<div class="full-width-label">Photos:</div>',
			'<div ng-repeat="photo in selectedPhotos">',
				'<img class="image-display" src="{{photo.dataUrl}}" ng-click="viewImage(photo.fileName)" />',
			'</div>',
			'<div class="full-width-label">Videos:</div>',
			'<div ng-repeat="video in selectedVideos">',
				'<video src="{{video.dataUrl}}" controls autoplay height="auto" width="65px" type="{{video.fileType}}">',
				'</video>',
			'</div>',
		  '</md-card>',
			'<md-button ng-show="selectedPhotos.length > 0" ng-click="clearAll()">clear all</md-button>',
			'<div class="fullscreen-container" id="fullScreen" ng-show="fullScreenObj" layout="column" layout-align="center center">',
				'<md-button ng-click="closeFullScreen()">close</md-button>',
				'<img class="fullscreen-image" src="{{fullScreenObj.dataUrl}}"/>',
			'</div>'].join(''),
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

			var readSelectedFile = function (file, index){
				readAsDataURL(file).then(function(result) {
					var selectedFile = file;
					var fileName = file.name + '_' + index;
					var fileType = file.type;

					var dataUrl = window.URL.createObjectURL(file);
					var img = new Image();
					img.src = dataUrl;
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

					scope.viewImage = function (fileName) {
						for (var i = 0; i < scope.selectedPhotos.length; i++) {
							if (scope.selectedPhotos[i].fileName === fileName){
								scope.fullScreenObj = scope.selectedPhotos[i];
								continue;
							}
						}

						if (!scope.fullScreenObj){
							alert('couldnt find full screen object!');
							return;
						}
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

			scope.onFileChange = function (e) {
				var selectedFiles = e.target.files;

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