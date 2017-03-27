PhotoDash.angular.controller('AlbumReviewCtrl', ['$scope', '$rootScope', '$compile', 'selectionService', function($scope, $rootScope, $compile, selectionService) {
    var vm = this;
	vm.thumbnailLimit = 60;
	
   vm.init = function(){
		//vm.thumbnails = selectionService.getPhotos();
		var activeAlbum = selectionService.getActiveAlbum();
		vm.thumbnails = activeAlbum.libraryItems;
		$scope.$apply();  
   };
   
    vm.goBack = function(){
        mainView.router.back({url: 'photos.html', force: true});    
    };
   
   vm.init();
   
}]);
