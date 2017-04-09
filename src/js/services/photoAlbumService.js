PhotoDash.angular.factory('photoAlbumService',['_', function (_) {
	var photoAlbums = [];
	
	var createAlbum = function(albumName, libraryItems){
		
		var newAlbum = {
			name: albumName,
			libraryItems: libraryItems
		};
		
		photoAlbums.push(newAlbum);
		
	};

	var removeAlbum = function(albumName){
		var album = _.findWhere(photoAlbums, {name: albumName});
		
		photoAlbums = _.without(photoAlbums, album);
	};
	
	var getPhotoAlbums = function(){
			return photoAlbums;
	};
	
	var updateAlbum = function(albumName, libraryItems){
		var album = _.findWhere(photoAlbums, { name: albumName });
		
		if (album){
			for (var i = 0; i < libraryItems.length; i++){
					album.libraryItems.push(libraryItems[i]);
			
			}
		}		
	};
		
	return {
		createAlbum: createAlbum,
		updateAlbum: updateAlbum,
		removeAlbum: removeAlbum,
		getPhotoAlbums: getPhotoAlbums
	}
 }]);
