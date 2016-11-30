
angular.module('dash-client').directive('fileInput', ['$q', '$compile', '$timeout','$templateRequest', '$compile', '$location', 
	function ($q, $compile, $timeout,$compile, $templateRequest, $location) {
		return {
			restrict: 'E',
			scope: {
				selectedVideos: '=?',
				inputType: '=',
                onLoadSuccess: '&',
				onPhotoLoaded: '&'
			},
			link: function (scope, element, attrs, ctrl) {
				scope.totalAdded = 0;
                scope.isLoading = false;
				scope.selectedPhotos = [];
				scope.selectedVideos = [];
				scope.fullScreenObj = null;
				scope.selectedMediaType = 'image';
				scope.selectedMediaTypeText = 'images';
				scope.templateLoaded = false;
				                
			    scope.loadImageData = function (src, i, callback){
                  var img = new Image();
                  img.onload = function(){
					//  console.log('Retrieving EXIF data...');
					  EXIF.getData(img, function(){
						   var tags = EXIF.getAllTags(this);
						   
						   if (callback){
							   var item = {
								   src: src,
								   orientation: tags.Orientation,
								   width: this.width,
								   height: this.height,
                                   pid: 'photoImage' + i
							   };
							   
							   callback(item);
						   }
					  });
                  }
                  
                  img.src = src;
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
                                                      
			  var readSelectedFile = function (file, index){
					readAsDataURL(file).then(function(result) {
						var selectedFile = file;
						var fileName = file.name;// + '_' + index;
                        
                       // console.log('FILE NAME ----->' + fileName);
						var fileType = file.type;
                        
                        var dataUrl = window.URL.createObjectURL(file);

						scope.closeFullScreen = function () {
							scope.fullScreenObj = null;
						}
               
                      
						if (fileType === 'image/jpeg' || fileType === 'image/png') {
							scope.loadImageData(dataUrl, index, function (imgData){
								var item = {
									file: selectedFile,
									fileName: fileName,
									fileType: fileType,
                                   // width: newSize[0],
                                   // height: newSize[1],
                                    width: imgData.width,
                                    height: imgData.height,
									dataUrl: dataUrl,
									pid: imgData.pid,
                                    src: imgData.src,
                                    orientation: imgData.orientation
								};
								
                                
								scope.onPhotoLoaded({photo: item});
								scope.totalAdded+=1;
								scope.$apply();
                                
								if (scope.totalAdded === scope.totalFiles - 1){
									scope.isLoading = false;
								}
                                
								//scope.selectedPhotos.push(item);
                                
                                /*if (scope.selectedPhotos.length === scope.totalFiles){
                                    scope.isLoading = false;
                                    scope.onLoadSuccess({photos: scope.selectedPhotos});
                                }*/
							});
							
						} else if(fileType === 'video' || fileType === 'video/quicktime'){
							var fileObj = {
								file: selectedFile,
								width: imgData.width,
								height: imgData.height,
								fileName: fileName,
								fileType: fileType,
								dataUrl: dataUrl,
								pid: 'photo' + index
							};
							
							scope.selectedVideos.push(fileObj);
						} else {
							console.log('FAILED TO LOAD INPUT ITEM! NOT A RECOGNIZED VIDEO OR IMAGE FILE :(');
						}

					}, function(error){
							alert('error: ' + error);
					}, function (notify) {
						
					});
			};
                
			scope.startSpinner = function(){
				scope.isLoading = true;
			};
				
			scope.onFileChange = function (e) {
				var files = document.querySelector('input[type=file]').files;
				
				for (var i = 0; i < files.length; i++){
					var file = files[i];
					setTimeout(readSelectedFile(file, i), i * 100);
				}
			};

			var isBound = false;
			
			$timeout(function(){
				var inputElement;
				if (scope.inputType === 'image'){
					if (!isBound){
						inputElement = angular.element(element[0].querySelector('#imageInput'));
						//console.log('Binding IMGE INPUT to ONFILECHANGE in DIRECTIVE');
						inputElement.bind('change', scope.onFileChange);
						scope.$apply();
						isBound = true;
						return;
					}
				}
				if (scope.inputType === 'video'){
					if (!isBound){
						inputElement = angular.element(element[0].querySelector('#videoInput'));
						//console.log('Binding VIDEO INPUT to ONFILECHANGE in DIRECTIVE');
						inputElement.bind('change', scope.onFileChange);
						scope.$apply();
						isBound = true;
						return;
					}
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
			
			scope.clearAll = function () {
				scope.selectedPhotos = [];
				scope.selectedVideos = [];
			}
		},
		template: '<div ng-include="getContentUrl()"></div>'
	}
}]);