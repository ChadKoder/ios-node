PhotoDash.angular.controller('PhotoAlbumCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    var vm = this;
    vm.totalPhotos = 0;
	vm.totalSelected = 0;
	
       vm.goBack = function(){
			mainView.router.back({url: 'photos.html', force: true});
    };
}]);
