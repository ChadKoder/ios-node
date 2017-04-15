PhotoDash.angular.factory('videoAlbumService',['_', function (_) {
	var videoAlbums = [];
	
	var createAlbum = function(albumName, file, callback){
		var randomId = Math.random().toString(36).substr(2, 16);
				
		var libraryItem = {
			id: randomId,
			file: file,
			fileName: file.name,
			creationDate: new Date().toLocaleString()			
		};		
		
		var newAlbum = {
			name: albumName,
			libraryItems: [libraryItem]
		};
		
		videoAlbums.push(newAlbum);
		
		if (callback){
				callback(newAlbum);
		}		
	};

	var removeAlbum = function(albumName){
		var album = _.findWhere(videoAlbums, {name: albumName});
		
		videoAlbums = _.without(videoAlbums, album);
	};
	
	var getVideoAlbums = function(){
			return videoAlbums;
	};
	
	var getVideoAlbum = function(name){
		return _.findWhere(videoAlbums, { name: name });
	};
	
	var updateAlbum = function(albumName, libraryItems){
		var album = _.findWhere(videoAlbums, { name: albumName });
		
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
		getVideoAlbums: getVideoAlbums,
		getVideoAlbum: getVideoAlbum
	}
 }]);
