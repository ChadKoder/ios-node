PhotoDash.angular.directive('popupPhotoLibrary', ['$rootScope', '_',
 function ($rootScope, _) {
	return {
		restrict: 'E',
		scope: {
			popupName: '=',
			selectedItems: '=',
			closeLibraryCallback: '&?'
		},
		link: function (scope, element, attrs, ctrl) {
			
			var itemsPerLoad = 84;
			scope.thumbnailLimit = 120;			
			
			var loading = false;
			
			/*
			if (!scope.popupName){
				scope.popupName = 'popup-photo-library';
			}*/
						
			//scope.classes = 'popup ' + scope.popupName + ' modal-in';
			
			 
			
			//var popupSelector = '.' + scope.popupName;
			
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
			
			scope.isSelected = function(id){
				var selectedItem = _.findWhere(scope.selectedItems, {id: id});
				//console.log('is selected??? --> ' + selectedItem);
				
				if (selectedItem){
					return true;
					
				} else {
					return false;
				}
			/*	var activeSelection = _.findWhere(scope.selectedItems, {albumName: scope.activeAlbum.albumName});
				if (!activeSelection){
					return false;
				}  else {
					if (!activeSelection.itemIds){
						return false;
					} else {
						return _.contains(activeSelection.itemIds, id);
					}
				}
				
				
				return false;*/
				//var activeSelection = _.findWhere($scope.selectedItems, {albumName: vm.activeAlbum.albumName});
				//return _.contains(activeSelection.itemIds, libraryItem.id);
				
						//return _.contains($scope.selectedItems, id);
		   };
		   
		   
		   
			scope.markSelected = function(libraryItem){
				if (scope.selectedItems.length > 0){
					/*var alreadySelected = _.find(scope.selectedItems, function(item){
						return item.id === libraryItem.id;
					});*/
					
					var alreadySelected = _.findWhere(scope.selectedItems, {id: libraryItem.id });
					 
					if (alreadySelected){
						 
						scope.selectedItems = _.without(scope.selectedItems, alreadySelected);						
						
					} else {
						scope.selectedItems.push(libraryItem);
					}
				} else {
					scope.selectedItems.push(libraryItem);
				}
			};
	
			var getPhotoLibrary = function(){	
				cordova.plugins.photoLibrary.getLibrary(function (result) {
						scope.library = result.library;
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
			
			scope.closeLibrary = function(){
				scope.closeLibraryCallback();
			};			
			
			scope.init = function(){				
				scope.selectedItems = [];		
				getPhotoLibrary();
			};		 
			
			$$('.infinite-scroll').on('infinite', function () {
            
				if (loading) return;
				loading = true;
                
				if (scope.thumbnailLimit >= scope.library.length) {
					// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
					PhotoDash.fw7.app.detachInfiniteScroll($$('.infinite-scroll'));
					// Remove preloader
					$$('.infinite-scroll-preloader').remove();
					return;
				}
			
			setTimeout(function(){
				scope.thumbnailLimit += itemsPerLoad;              				
				loading = false;
				scope.$apply();
                
                }, 200);
			});
			
			$$('.popup-library').on('popup:open', function () {				
				scope.init();
			});
		},
		//templateUrl: 'photo-library.html'
		templateUrl: 'popup-photo-library.html'
	}
}]);
