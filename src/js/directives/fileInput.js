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
							   console.log('DIRECTIVE..... ADDING PID---> ' + item.pid);
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
                        
                        
                        /***
                        
                         https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg" itemprop="contentUrl" data-size="1024x683">
                         <img src="https://farm7.staticflickr.com/6175/6176698785_7dee72237e_m.jpg" itemprop="thumbnail" alt="Image description" />
                         </a>
                         <figcaption itemprop="caption description">Image caption 3</figcaption>
                         </figure>
                         
                         <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
                         <a href="https://farm6.staticflickr.com/5023/5578283926_822e5e5791_b.jpg" itemprop="contentUrl" data-size="1024x768">
                         <img src="https://farm6.staticflickr.com/5023/5578283926_822e5e5791_m.jpg" itemprop="thumbnail" alt="Image description" />
                         </a>
                         <figcaption itemprop="caption description">Image caption 4</figcaption>
                         </figure>
                         
                         
                         </div>
                         
                         <h2>Second gallery:</h2>
                         
                         <div class="my-gallery" itemscope itemtype="http://schema.org/ImageGallery">
                         
                         
                         

                        
                        
                        
                        
                        */

						if (fileType === 'image/jpeg' || fileType === 'image/png') {
							scope.loadImageData(dataUrl, index, function (imgData){
                             //   console.log('FILE NAME???---> ' + fileName);
                                //if (!fileName){
                                  //  fileName = 'photo_file_' + index;
                               //     console.log('created file name:' + fileName);
                               // }
								var item = {
									file: selectedFile,
									fileName: fileName,
									fileType: fileType,
                                    width: imgData.width,
                                    height: imgData.height,
									dataUrl: dataUrl,
									pid: imgData.pid,
                                    src: imgData.src,
                                    orientation: imgData.orientation
								};
                              //  console.log('ADDED FILENAME: ' + item.fileName);
								
								// console.log('adding photo item... w: ' + item.w + ' h: ' + item.h + ' dataUrl: ' + item.dataUrl + ' pid: ' + item.pid);
								//console.log('DIRECTIVE.... Adding item PID: ' + item.pid + ' WIDTH: ' + item.width + ' HEIGHT: ' + item.height);
								scope.selectedPhotos.push(item);
                                
                                if (scope.selectedPhotos.length === scope.totalFiles){
                                                
                                              //  console.log('BEGIN <---------------------');
                                                
                                               // console.log('DIRECTIVE.... 1--->  PID => ' + scope.selectedPhotos[0].pid);
                                                
                                               // console.log('DIRECTIVE.... 2--->  PID => ' + scope.selectedPhotos[1].pid);
                                                
                                               // console.log('DIRECTIVE.... 3--->  PID => ' + scope.selectedPhotos[2].pid);
                                               // console.log('END <---------------------');
                                    //scope.photosAreLoaded = true;
									//console.log('DIRECTIVE... LOADING IMAGES COMPLETE! TOTAL--->' + scope.selectedPhotos.length);
                                    scope.$apply();
                                }
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
				
				scope.onFileChange = function (e) {
					var selectedFiles = e.target.files;
					scope.totalFiles = selectedFiles.length;

					for (var i = 0; i < selectedFiles.length; i++){
						var file = selectedFiles[i];
						setTimeout(readSelectedFile(file, i), i * 100);
					}
				};
                
                var isBound = false;
				
				$timeout(function(){
					var inputElement;
					if (scope.inputType === 'image'){
                        if (!isBound){
                            inputElement = angular.element(element[0].querySelector('#imageInput'));
                            console.log('Binding IMGE INPUT to ONFILECHANGE in DIRECTIVE');
                            inputElement.bind('change', scope.onFileChange);
                            scope.$apply();
                            isBound = true;
                            return;
                        }
					}
					if (scope.inputType === 'video'){
                        if (!isBound){
                            inputElement = angular.element(element[0].querySelector('#videoInput'));
                            console.log('Binding VIDEO INPUT to ONFILECHANGE in DIRECTIVE');
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