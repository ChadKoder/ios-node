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
			},
			template: '<div ng-include="getContentUrl()"></div>'
		}
}]);