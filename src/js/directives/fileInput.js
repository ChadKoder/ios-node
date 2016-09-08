//js/directives/fileInput.js
angular.module('dash-client').directive('fileInput', ['$q', '$compile', '$timeout', function ($q, $compile, $timeout) {
    return {
          restrict: 'E',
          template:[                
                '<md-radio-group ng-change="toggleMediaText(selectedMediaType)" id="radioGrp" class="md-primary" layout="row" layout-align="center center" ng-model="selectedMediaType" class="radioButton">',
                  '<md-radio-button value="image" aria-label="image">Photos</md-radio-button>',
                  '<md-radio-button value="video" aria-label="video">Video</md-radio-button>',
              '</md-radio-group>',
                '<input class="ng-hide fileInput" accept="video/*" id="videoInput" type="file" />',
                '<input class="ng-hide fileInput" accept="image/*" multiple id="imageInput" type="file" />',
              '<md-card  md-ink-ripple layout="row" flex style="background: -webkit-linear-gradient(top, #545454, #929292); width: 95%; position: relative;"><label for="{{selectedMediaType}}Input" style="width: 100%; font-size: 26pt; text-align: center; height: 100%; color: white;">Select {{selectedMediaTypeText}}</label></md-card>',
              '<md-card flex layout="row" layout-wrap flex="25" id="albumReview" ng-show="selectedPhotos.length > 0 || selectedVideos.length > 0" style="background-color: #9E9E9E;">',
                  '<div style="width: 100%;">Total Selected: {{ selectedPhotos.length + selectedVideos.length }}</div>',
                  '<div style="width: 100%;">Photos:</div>',
                  '<div ng-repeat="photo in selectedPhotos">',
                      '<img src="{{photo.dataUrl}}" ng-click="viewImage(photo.fileName)" style="width: 65px; height: auto; padding: 0 10px 0 10px;" />',
                  '</div>',
                  '<div style="width: 100%;">Videos</div>',
                  '<div ng-repeat="video in selectedVideos">',
                     '<video src="{{video.dataUrl}}" controls autoplay height="auto" width="65px" type="{{video.fileType}}">',
                          //'<source src="{{video.dataUrl}}" type="{{video.fileType}}">',
                        ////'<source src="{{video.dataUrl}}" type="video">',
                     '</video>',
                  '</div>',
               //   '<md-card id="cardImage"></div></md-card>',
              '</md-card>',
                '<md-button ng-show="selectedPhotos.length > 0" ng-click="clearAll()">clear all</md-button>',
                '<div id="fullScreen" ng-show="fullScreenObj" layout="column" layout-align="center center" style="z-index: 9999; top: 0px; left: 0; width: 100%; height: 100%; position: fixed; background-color: #9E9E9E;">',
                    '<md-button ng-click="closeFullScreen()">close</md-button>',
                    '<img style="width: 90%; height: auto;" src="{{fullScreenObj.dataUrl}}"/>',
                '</div>'].join(''),
          replace: false,
          scope: {
              selectedPhotos: '=?',
              selectedVideos: '=?',
              files: '=?'
              
          },
          link: function (scope, element, attrs, ctrl) {
            // scope.fullScreen = false;
                                                      
                  scope.selectedPhotos = [];
                  scope.selectedVideos = [];
                  
                  scope[attrs.ngModel] = scope.selectedPhotos;
            scope.fullScreenObj = null;
            scope.selectedMediaType = 'image';
           // scope.isImage = (scope.selectedMediaType === 'image');
            
            scope.selectedMediaTypeText = 'images';
           
            if (attrs.disptext){
              scope.buttonText = attrs.disptext;
          }
          
          var fileInputId = '#' + scope.selectedMediaType + 'Input';
      
        //  var elFileInput = angular.element(element[0].querySelector(fileInputId));
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
              deferred.resolve( {
                   'index': index,
                   'result': reader.result
               });
          
          };
          
          reader.onerror = function (e) {
          alert('errorrr!!!');
             // deferred.reject(reader.result);
              
             // var errorCode = e.target.error.code;
              
             // alert('Error! ==> ' + errorCode);
          };
          
          reader.readAsArrayBuffer(file);
          
          
          return deferred.promise;
          
          };
                                                      
        var readSelectedFile = function (file, index){
           // alert('file type: ' + file.type);
            readAsDataURL(file).then(function(result) {
               var selectedFile = file;
               var fileName = file.name + '_' + index;
               var fileType = file.type;
               
               var dataUrl = window.URL.createObjectURL(file);
              // var viewImageName = "\'" + fileName + "\'";
               var img = new Image();
               img.src = dataUrl;
               var fileObj = {};
               var fileObj = {
                   file: selectedFile,
                   fileName: fileName,
                   fileType: fileType,
                   dataUrl: dataUrl
               };
               
              // alert('fileType: ' + fileObj.fileType);
             
               
               /*img.onload = function (){
                   fileObj.width = img.width;
                   fileObj.height = img.height;
                   if (!scope.$$phase) {
                       scope.$apply();
                   }
               }*/
			   
              /* scope.toggleMultiSelect = function () {
                   if (selectedMediaType === 'image'){
                       alert('multiple');
                       document.getElementById('fileInputTest').createAttribute('multiple');
                   } else {
                       alert('NOT multiple');
                       document.getElementById('fileInputTest').removeAttribute('multiple');
                   }
               }*/
               scope.closeFullScreen = function () {
                  // var elCardImage = document.getElementById('cardImage');
                  // var elFullScreen = document.getElementById('fullScreen');
                  // elCardImage.removeChild(elFullScreen);
                  
                    scope.fullScreenObj = null;
                 //   scope.fullScreen = false;
               
               }
               
            scope.viewVideo = function () {
                //TODO: Finish this...
            }
               
           scope.viewImage = function (fileName) {
          
               
               /*var elFullScreen = document.getElementById('fullScreen');
               if (elFullScreen) {
                   return;
               }*/
               
               for (var i = 0; i < scope.selectedPhotos.length; i++) {
                   if (scope.selectedPhotos[i].fileName === fileName){
                       scope.fullScreenObj = scope.selectedPhotos[i];
                              //       scope.fullScreen = true;
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
             // alert('video: ' + fileObj.fileType);
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
      
     // elFileInput.bind('change', scope.onFileChange);
    //  elRadioGrp.bind('change', scope.toggleMediaText);
           elImageInput.bind('change', scope.onFileChange);
           elVideoInput.bind('change', scope.onFileChange);
        
      }
	}
}]);