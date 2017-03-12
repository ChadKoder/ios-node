PhotoDash.angular.factory('selectionService', function () {
       var selectedPhotos = [];
	   var selectedVideos = [];
       var service = this;
       
       service.showPreloader = function(msg){
           PhotoDash.fw7.app.showPreloader(msg);
       };
       
       service.hidePreloader = function(){
           PhotoDash.fw7.app.hidePreloader();
       };
											  
       var addPhoto = function(libraryItem){
           selectedPhotos.push(libraryItem);           
       };
       
	   var addVideo = function(videoItem){
			selectedVideos.push(videoItem);
	   };
	   
       var remove = function(id){
		   selectedPhotos = _.reject(selectedPhotos, function(pItem){
		   		return pItem.id === id;
		   });
       };
       
       var clearPhotos = function(){
           selectedPhotos = [];
       };
	   
	   var clearVideos = function(){
		 selectedVideos = [];
	   };
       
       var getPhotos = function(){
           return selectedPhotos;
       };
	   
	   var getVideos = function(){
			return selectedVideos;
	   }
      
           
      return {
           addPhoto: addPhoto,
		   addVideo: addVideo,
           remove: remove,
           clearPhotos: clearPhotos,
		   clearVideos: clearVideos,
           getPhotos: getPhotos,
		   getVideos: getVideos
        }

 });
