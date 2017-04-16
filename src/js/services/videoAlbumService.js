PhotoDash.angular.factory('videoAlbumService',['_', function (_) {
	var albums = [];
	
	var createLibraryItem = function(file){
		var randomId = Math.random().toString(36).substr(2, 16);
				
			return libraryItem = {
			id: randomId,
			file: file,
			fileName: file.name
		};		
	};
	
	var createAlbum = function(albumName, file, callback){
		var randomId = Math.random().toString(36).substr(2, 16);
				
		var libraryItem = createLibraryItem(file);
		
		var newAlbum = {
			name: albumName,
			libraryItems: [libraryItem]
		};
		
		albums.push(newAlbum);
		
		if (callback){
			callback(newAlbum);
		}		
	};

	var removeAlbum = function(albumName){
		var album = _.findWhere(albums, {name: albumName});
		
		albums = _.without(albums, album);
	};
	
	var getAlbums = function(){
			return albums;
	};
	
	var getAlbum = function(name){
		return _.findWhere(albums, { name: name });
	};
	
	var addItem = function(albumName, file){
		var album = _.findWhere(albums, { name: albumName });
		var libraryItem = createLibraryItem(file);
				
		if (album){
			album.libraryItems.push(libraryItem);
		}		
	};
		
	return {
		createAlbum: createAlbum,
		removeAlbum: removeAlbum,
		getAlbums: getAlbums,
		getAlbum: getAlbum,
		addItem: addItem
	}
 }]);
