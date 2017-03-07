PhotoDash.angular.factory('fileService',['$rootScope', '$q', function ($rootScope, $q) {
       var photos = [];
       var fileURLs = [];
	   var library = [];
	   var photoURLs = [];
	   var canvasList = [];
     var currLimit = 0;
                                         
  		   
	   var init = function(fullLibrary){
	       library = fullLibrary;
		};
	   
	   var getCanvasList = function(){
	      return canvasList;
	   };
										 
        var getPhotos = function(){
           return photos;
       };
       
       var getTotalPhotos = function(){
           return files.length;
        };
		
		var getPhotoURLs = function(){
		   return photoURLs;
		};
	
           
      return {
		   getPhotoURLs: getPhotoURLs,
		   init: init,
		   getCanvasList: getCanvasList,
           getPhotos: getPhotos,
           getTotalPhotos: getTotalPhotos
        }

 }]);
