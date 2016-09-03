//js/directives/fileInput.js
angular.module('dash-client').directive('fileInput', ['$q', '$compile', function ($q, $compile) {
	return {
		   restrict: 'E',
		   template: '<div id="cardImage" style="background-color: #9E9E9E;"><md-button class="md-primary md-raised file-input-container" ng-click="vm.openDialog($event, this)"> {{buttonText}}<input multiple accept="accept/*" type="file" class="fileInput"></input></md-button><div class="albumReview" layout="row"></div></div>',
		   replace: false,
		   scope: {
			 selectedFiles: '=?'
		   },
		   link: function (scope, element, attrs, ctrl) {
               if (attrs.disptext){
                   scope.buttonText = attrs.disptext;
               }
               
               if (attrs.accept){
                   scope.accept = attrs.accept;
               } else {
                   scope.accept = 'image/*';
               }
               
               var elFileInput = angular.element(element[0].querySelector('.fileInput'));
			   
			   scope.selectedFiles = [];
			   scope[attrs.ngModel] = scope.selectedFiles;
			   
               var readAsDataURL = function (file, index) {
                   var deferred = $q.defer();
                   
                   var reader = new FileReader();
                   
                   reader.onloadstart = function () {
                       deferred.notify(0);
                   };
                   
                   
                   reader.onload = function (e) {
                   };
                   
                  reader.onloadend = function (e) {
                       deferred.resolve( {
                           'index': index,
                           'result': reader.result
                       });
                   };
                   
                   reader.onerror = function (e) {
                       deferred.reject(reader.result);
                       
                       var errorCode = e.target.error.code;
                       
                       alert('Error!');
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
                        
                        img.onload = function (){
                            fileObj.width = img.width;
                            fileObj.height = img.height;
                           // if (!scope.$$phase) {
                          //     scope.$apply();
                         //  }
                        }
               
                       
                       scope.closeFullScreen = function () {
                           var elCardImage = document.getElementById('cardImage');
                           var elFullScreen = document.getElementById('fullScreen');
                           elCardImage.removeChild(elFullScreen);
                           
                       }
                       
                       scope.viewImage = function (fileName) {
                           var fullScreenObj;
                           
                           var elFullScreen = document.getElementById('fullScreen');
                           if (elFullScreen) {
                                return;
                            }                             
                       
                           for (var i = 0; i < scope.selectedFiles.length; i++) {
                               if (scope.selectedFiles[i].fileName === fileName){
                                   fullScreenObj = scope.selectedFiles[i];
                                    continue;
                               }                              
                           }
                       
                           if (!fullScreenObj){
                               alert('couldnt find full screen object!');
                               return;
                           }                           
                           
                           var fullScreen = '<div id="fullScreen" style="background-color: #545151; z-index: 9999; top: 0; left: 0; width: 100%; height: 100%; position: fixed;" flex></span><md-button ng-click="closeFullScreen()" style="background-color: #545151; top: 9px;">close</md-button><md-card layout="row" layout-align:"center"><img flex style="width: 90%; height:auto;" src="' + fullScreenObj.dataUrl + '" /> </md-card></div>';
                         /*  var fullScreen = '<div id="fullScreen" style="background-color: #545151; z-index: 9999; position: fixed; top:0; left: 0; height:' + fullScreenObj.height + 'px;' + ' width:' + fullScreenObj.width + 'px;' + ';"><span flex></span><md-button ng-click="closeFullScreen()" style="background-color: #545151">close</md-button><img style="display: block; height: ' + fullScreenObj.height + 'px;' + ' width:' + fullScreenObj.width + 'px;' + '" src="' + fullScreenObj.dataUrl + '" /></div>';*/
                           var elContent = angular.element(element[0].querySelector('#cardImage'));
                         
                           elContent.append(fullScreen);
                           $compile(elContent)(scope);
                           
                       }
                       
                       var viewImageName = "\'" + fileName + "\'";
                       
                       scope.selectedFiles.push(fileObj);
                       var albumTemplate = '';
                       if (fileType === 'image/png' || fileType === 'image/jpeg'){
                           albumTemplate = '<img class="' + viewImageName + '" ng-click="viewImage(' + viewImageName + ')" style="padding-right: 5px; width: 25%; height: 25%;" src="' + dataUrl + '" />';
                       } else {
                           albumTemplate = '<div>Failed to load image: '  + viewImageName + '</div>'
                       }
                       
                       var elAlbumReview = angular.element(element[0].querySelector('.albumReview'));
                      elAlbumReview.append(albumTemplate);
                      $compile(elAlbumReview)(scope);
                                            
                   }, function(error){
                       alert('error: ' + error);
                   }, function (notify) {
                   });
               };
			   
			   scope.onFileChange = function (e) {
					var selectedFiles = e.target.files;
                    
                    for (var i = 0; i < selectedFiles.length; i++){
                        var file = selectedFiles[i];
                        setTimeout(readSelectedFile(file, i), i * 100);
                    }
			   };
			   
			   elFileInput.bind('change', scope.onFileChange);
			   
			   
			   
		   }
	   }
	}]);