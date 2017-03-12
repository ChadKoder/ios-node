PhotoDash.angular.directive('myPhotoLibrary', ['$q', '$rootScope', '$compile', 'selectionService', '_',
 function ($q, $rootScope, $compile, selectionService, _) {
	return {
		restrict: 'E',
		scope: {
			fullLibrary: '=',
            totalPhotos: '=',
            totalSelected: '='
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
			
			var getFullLibrary = function(){
				cordova.plugins.photoLibrary.requestAuthorization(function () {
					cordova.plugins.photoLibrary.getLibrary(function (result) {
						console.log('DIRECTIVE -- getFullLibrary setting fullLibrary to total of: ' + result.library.length);
                        scope.thumbnails = result.library;
                        scope.totalPhotos = result.library.length;
						 
						scope.selectedItems = _.pluck(selectionService.getPhotos(), 'id');
						scope.totalSelected = scope.selectedItems.length;
						 
			PhotoDash.fw7.app.hidePreloader();
			
			scope.$apply();
			
					}, function(err){
						console.log('getFullLibrary: error - ' + err);
					},{
					
						thumbnailWidth: 80,
                        thumbnailHeight: 80
					});

				},function () {
					// User denied the access
					PhotoDash.fw7.app.hidePreloader();

				}, // if options not provided, defaults to {read: true}.
				{
					read: true,
					write: true
				});
             
			   
			};
			
			scope.$on('$destroy', function(){
				console.log('my directvie -- $destroy -- cleanup!');
				cleanup();
			});
			
			
           getFullLibrary();
		   
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
        template: '<div style="display: inline; position: relative;" ng-repeat="item in thumbnails | orderBy: \'-creationDate\' | limitTo: thumbnailLimit track by item.id"><img ng-click="markSelected(item)" width="75" style="display: inline; position: relative;" id="{{item.id}}" ng-src="{{item.thumbnailURL}}" />	<i ng-if="isSelected(item.id)" class="f7-icons color-green" style="position: absolute; top: 0; right: 4px; display:inline; font-size: 14px;">check_round_fill</i></div><div class="infinite-scroll-preloader">	<div class="preloader"></div></div>'
	}
}]);
