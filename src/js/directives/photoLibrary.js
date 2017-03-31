PhotoDash.angular.directive('photoLibrary', ['$q', '$rootScope', '$compile', 'selectionService', '_',
 function ($q, $rootScope, $compile, selectionService, _) {
	return {
		restrict: 'E',
		scope: {
			fullLibrary: '=',
            totalPhotos: '=',
            totalSelected: '=',
			albumName: '='
		},
		link: function (scope, element, attrs, ctrl) {
			var itemsPerLoad = 48;
			scope.thumbnailLimit = 84;
            scope.selectedItems = [];
            scope.totalSelected = 0;
           
           scope.isSelected = function(id){
				return _.contains(scope.selectedItems, id);
           };
		
			scope.markSelected = function(libraryItem){
		   		var alreadySelected = _.contains(scope.selectedItems, libraryItem.id);
				
				if (alreadySelected){
					scope.selectedItems = _.reject(scope.selectedItems, function (itemId){
						return itemId === libraryItem.id;
					});
					
					selectionService.remove(libraryItem.id);
					scope.totalSelected--;
					
				} else {
					scope.selectedItems.push(libraryItem.id);
					selectionService.addPhoto(libraryItem);
               		 scope.totalSelected++;
				}
            };
			
			var cleanup = function(){
				scope.selectedItems = null;
				scope.thumbnails = null;
				scope.totalSelected = null;
				scope.thumbnailLimit = null;
				console.log('FINISHED CLEANUP....');
			};
			
			var requestAuthorization = function(){
				cordova.plugins.photoLibrary.requestAuthorization(
				  function () {
					//User allowed access
					getPhotoLibrary();
				  },
				  function (err) {
					// User denied access
					console.log('User denied access to photo library.');
				  }, 
				  {
					read: true,
					write: true
				  });
			};
			
			var getPhotoLibrary = function(){
				cordova.plugins.photoLibrary.getLibrary(function (result) {
						scope.thumbnails = result.library;
						scope.totalPhotos = result.library.length;
						//scope.selectedItems = _.pluck(selectionService.getPhotos(), 'id');
						//scope.totalSelected = scope.selectedItems.length;
						PhotoDash.fw7.app.hidePreloader();
						scope.$apply();
						
					}, function(err){
						if (err.startsWith('Permission')) {
							requestAuthorization();
						} else {
							console.log('getFullLibrary failed with error: ' + err);
						}
					},{
					
						thumbnailWidth: 80,
                        thumbnailHeight: 80
					});
			};
			
			var init = function(){
				getPhotoLibrary();
			};
			
			scope.$on('$destroy', function(){
				console.log('my directvie -- $destroy -- cleanup!');
				cleanup();
			});
			
			scope.getContentUrl = function(){
				return 'photo-library.html';
			};
			
			
           init();
		   
           var loading = false;
		   
			$$('.infinite-scroll').on('infinite', function () {
              
				if (loading) return;
				loading = true;
                
				if (scope.thumbnailLimit >= scope.thumbnails.length) {
					// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
					PhotoDash.fw7.app.detachInfiniteScroll($$('.infinite-scroll'));
					// Remove preloader
					$$('.infinite-scroll-preloader').remove();
					return;
				}
			
			setTimeout(function(){
				scope.thumbnailLimit += itemsPerLoad;
              //  $rootScope.$emit('lazyImg:refresh');
				//scope.$apply();
				loading = false;
				scope.$apply();
                
                }, 200);
			});
		},
		//templateUrl: 'photo-library.html'        
		template: '<div ng-include="getContentUrl()"></div>'
	}
}]);
