PhotoDash.angular.factory('photoAlbumService',['_', function (_) {
	var albums = [];
	
	var createAlbum = function(albumName, libraryItems){
		
		var newAlbum = {
			name: albumName,
			libraryItems: libraryItems
		};
		
		albums.push(newAlbum);
		
	};

	var removeAlbum = function(albumName){
		var album = _.findWhere(albums, {name: albumName});
		
		photoAlbums = _.without(albums, album);
	};
	
	var getAlbums = function(){
			return albums;
	};
	
	var getAlbum = function(name){
		return _.findWhere(albums, { name: name });
	};
	
	var updateAlbum = function(albumName, libraryItems){
		var album = _.findWhere(albums, { name: albumName });
		
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
		getAlbums: getAlbums,
		getAlbum: getAlbum
	}
 }]);
