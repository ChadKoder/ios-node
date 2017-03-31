PhotoDash.angular.factory('selectionService',['_', function (_) {
       var photoAlbums = [];
	   var selectedVideos = [];
	   var videoAlbums = [];
	   var activePhotoAlbum = [];
	   var activeVideoAlbum = [];
       var service = this;
       
       service.showPreloader = function(msg){
           PhotoDash.fw7.app.showPreloader(msg);
       };
       
       service.hidePreloader = function(){
           PhotoDash.fw7.app.hidePreloader();
       };

       var addPhoto = function(libraryItem){
			 var currentAlbumName = activePhotoAlbum.albumName;
			 console.log('*** ADDING PHOTO  to current album name -- ' + currentAlbumName);
			var currentAlbum = _.find(photoAlbums, function(obj){ 
				return obj.albumName === currentAlbumName;
			});
			
			if (currentAlbum){
				currentAlbum.libraryItems.push(libraryItem);
				activePhotoAlbum = currentAlbum;
			} else {
				var album = {
					albumName: currentAlbumName,
					libraryItems: [libraryItem]
				};
				
				photoAlbums.push(album);
			}
       };
	   
	   var addVideo = function(videoItem){
		   var item = {
			   'blob': videoItem,
			   'fileName': videoItem.name
			}
			//selectedVideos.push(videoItem);
			 var currentAlbumName = activeVideoAlbum.albumName;
			 console.log('*** ADDING PHOTO  to current album name -- ' + currentAlbumName);
			var currentAlbum = _.find(videoAlbums, function(obj){ 
				return obj.albumName === currentAlbumName;
			});
			
			var randomId = Math.floor(Math.random() * (max - min)) + min;
			var min = 1000;
			var max = 999999;
			var today = new Date();
			
			if (currentAlbum){
				console.log('ADDING VIDEO TO CURRENT ALBUM: ' + currentAlbumName);
				currentAlbum.libraryItems.push(item);
				activeVideoAlbum = currentAlbum;
			} else {
				
				console.log('creating new video album : ' + currentAlbumName);
				var album = {
					albumName: currentAlbumName,
					libraryItems: [item]
				};
				
				videoAlbums.push(album);
			}
	   };
	   
       var remove = function(id){
		   photoAlbums = _.reject(photoAlbums, function(pItem){
		   		return pItem.id === id;
		   });
       };
       
       var removePhotoAlbum = function(albumName){
           photoAlbums = _.reject(photoAlbums, function(album){
			  return album.albumName === albumName; 
		   });
		   
		   return photoAlbums;
       };
	   
	   var removeVideoAlbum = function(albumName){
		 videoAlbums = _.reject(videoAlbums, function(album){
			  return album.albumName === albumName; 
		   });
		   
		   return videoAlbums;
	   };
       
	   var getVideoAlbums = function(){
			return videoAlbums;
	   }
	   
	   var getPhotoAlbums = function(){
			return photoAlbums;
	   };
	   
		var setActivePhotoAlbum = function(albumName){
			activePhotoAlbum = _.find(photoAlbums, function(album){
				return album.albumName === albumName;
			});
			
			if (!activePhotoAlbum){
				activePhotoAlbum = { albumName: albumName, libraryItems: [] };
			}
		};
		
		var setActiveVideoAlbum = function(albumName){
			activeVideoAlbum = _.find(videoAlbums, function(album){
				return album.albumName === albumName;
			});
			
			if (!activeVideoAlbum){
				activeVideoAlbum = { albumName: albumName, libraryItems: [] };
			}
		};
		
		var getActiveVideoAlbum = function(){
			return activeVideoAlbum;
		};
		
		var getActivePhotoAlbum = function(){
			return activePhotoAlbum;
		};
		
		var doesAlbumExist = function(albumName){
			var exists = _.findWhere(photoAlbums, { 'albumName': albumName });
			return exists;
		};
           
      return {
           addPhoto: addPhoto,
		   addVideo: addVideo,
           remove: remove,
           removePhotoAlbum: removePhotoAlbum,
		   removeVideoAlbum: removeVideoAlbum,
		   getVideoAlbums: getVideoAlbums,
		   getPhotoAlbums: getPhotoAlbums,
		   setActivePhotoAlbum: setActivePhotoAlbum,
		   getActivePhotoAlbum: getActivePhotoAlbum,
		   setActiveVideoAlbum: setActiveVideoAlbum,
		   getActiveVideoAlbum: getActiveVideoAlbum,
		   doesAlbumExist: doesAlbumExist
        }

 }]);
