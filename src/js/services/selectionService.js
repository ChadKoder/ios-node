PhotoDash.angular.factory('selectionService',['_', function (_) {
       var photoAlbums = [];
	   var selectedVideos = [];
	   var activeAlbum = [];
       var service = this;
       
       service.showPreloader = function(msg){
           PhotoDash.fw7.app.showPreloader(msg);
       };
       
       service.hidePreloader = function(){
           PhotoDash.fw7.app.hidePreloader();
       };

       var addPhoto = function(libraryItem){
			 var currentAlbumName = activeAlbum.albumName;
			 console.log('*** ADDING PHOTO  to current album name -- ' + currentAlbumName);
			var currentAlbum = _.find(photoAlbums, function(obj){ 
				return obj.albumName === currentAlbumName;
			});
			
			if (currentAlbum){
				currentAlbum.libraryItems.push(libraryItem);
				activeAlbum = currentAlbum;
			} else {
				var album = {
					albumName: currentAlbumName,
					libraryItems: [libraryItem]
				};
				
				photoAlbums.push(album);
			}
       };
	   
	   var addVideo = function(videoItem){
			selectedVideos.push(videoItem);
	   };
	   
       var remove = function(id){
		   photoAlbums = _.reject(photoAlbums, function(pItem){
		   		return pItem.id === id;
		   });
       };
       
       var clearPhotos = function(){
           photoAlbums = [];
       };
	   
	   var clearVideos = function(){
		 selectedVideos = [];
	   };
       
	   var getVideos = function(){
			return selectedVideos;
	   }
	   
	   var getPhotoAlbums = function(){
			return photoAlbums;
	   };
	   
		var setActiveAlbum = function(albumName){
			activeAlbum = _.find(photoAlbums, function(album){
				return album.albumName === albumName;
			});
			
			if (!activeAlbum){
				activeAlbum = { albumName: albumName, libraryItems: [] };
			}
		};
		
		var getActiveAlbum = function(){
			return activeAlbum;
		};
		
		var doesAlbumExist = function(albumName){
			var exists = _.findWhere(photoAlbums, { 'albumName': albumName });
			return exists;
		};
           
      return {
           addPhoto: addPhoto,
		   addVideo: addVideo,
           remove: remove,
           clearPhotos: clearPhotos,
		   clearVideos: clearVideos,
		   getVideos: getVideos,
		   getPhotoAlbums: getPhotoAlbums,
		   setActiveAlbum: setActiveAlbum,
		   getActiveAlbum: getActiveAlbum,
		   doesAlbumExist: doesAlbumExist
        }

 }]);
