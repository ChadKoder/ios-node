PhotoDash.angular.directive('myPhotoLibrary', ['$q', '$rootScope', '$compile', 'selectionService', 'fileService', '_',
 function ($q, $rootScope, $compile, selectionService, fileService, _) {
	return {
		restrict: 'E',
		scope: {
			fullLibrary: '=',
            totalPhotos: '=',
            totalSelected: '='
		},
		link: function (scope, element, attrs, ctrl) {
			var itemsPerLoad = 40;
			scope.thumbnailLimit = 60;
            scope.selectedItems = [];
            scope.totalSelected = 0;
         
               var getOptions = function(items){
                   var options = {
                       //   arrowEl: true,
                       // tapToToggleControls: true,
                       history: false,
                       loop: true,
                      // timeToIdle: 4000,
                      showAnimationDuration: 100,
                       showHideOpacity: true,
                      // hideAnimationDuration: 333,
                       //bgOpacity: 1,
                       spacing: 0.10,
                       //allowPanToNext: true,
                       //maxSpreadZoom: 2,
                       pinchToClose: true,
                       closeOnScroll: false,
                       closeOnVerticalDrag: true,
                       mouseUsed: false,
                       escKey: false,
                       arrowKeys: false,
                       galleryPIDs: true,
                       preload: [1,1],
                       //mainClass: "testClass1",
                       focus: true,
                       isClickableElement: function (el){
                       return false;
                       },
                       modal: true,
                       //barsSize: {top:55, bottom: 'auto'},
                       //timeToIdleOutside: 1000,
                       //loadingIndicatorDelay: 1000,
                       addCaptionHTMLFn: function (item, captionEl, isFake){
                       captionEl.children[0].innerHTML = 'Caption Test1';
                       return true;
                       },
                      // closeEl: true,
                       //captionEl: true,
                      // fullscreenEl: true,
                      // zoomEl: true,
                      // shareEl: false,
                      // counterEl: true,
                      // arrowEl: true,
                      // preloaderEl: true,
                       tapToClose: false,
                      // tapToToggleControls: true,
                       clickToCloseNonZoomable: false,
                      // closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'],
                       indexIndicatorSep: '/',
                       getDoubleTapZoom: function(isMouseClick, item) {
                           
                           // isMouseClick          - true if mouse, false if double-tap
                           // item                  - slide object that is zoomed, usually current
                           // item.initialZoomLevel - initial scale ratio of image
                           //                         e.g. if viewport is 700px and image is 1400px,
                           //                              initialZoomLevel will be 0.5
                           
                           if(isMouseClick) {
                           
                           // is mouse click on image or zoom icon
                            
                           console.log('Mouse Click!------------------------');
                            // zoom to original
                           return 1;
                           
                           // e.g. for 1400px image:
                           // 0.5 - zooms to 700px
                           // 2   - zooms to 2800px
                           
                           } else {
                           
                           // is double-tap
                             console.log('DOUBLE TAP!---------------------------');
                           
                           // zoom to original if initial zoom is less than 0.7x,
                           // otherwise to 1.5x, to make sure that double-tap gesture always zooms image
                           return item.initialZoomLevel < 0.7 ? 1 : 1.5;
                           }
                       },
                                               
                    getThumbBoundsFn: function(index){
                       var thumbnail = items[index].el;
                       var rect = thumbnail.getBoundingClientRect();
                       var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                       
                                              
                       var returnObj = {
                           x: rect.left,
                           y: rect.top,
                           w: 80
                       };
                       
                      
                       return returnObj;
                       
                       //return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                       }//,
                       //showAnimationDuration: 1
                   };
                   
               return options;
               };
                            
            
            
           var getElement = function(id){
               var imageEls = document.querySelectorAll('img');
               
               for (var i = 0; i < imageEls.length; i++){
                   var imageEl = imageEls[i];
                   var imagepid = imageEl.getAttribute('id');
                   if (id === imagepid){
                        return imageEl;
                       break;
                   }
               }
           };
           
           scope.isSelected = function(id){
               //TODO: clean this up, use something better!
               for (var i = 0; i < scope.selectedItems.length; i++){
                   if (scope.selectedItems[i] === id){
                      return true;
                   
                   }
               }
               
               return false;
           
           };
           
           var isItemSelected = function(id){
           
               for (var i = 0; i < scope.selectedItems.length; i++){
                   if (scope.selectedItems[i] === id){
                     return true;
                   }
               }
               
               return false;
           
           };
           
           var getSelectedItemIndex = function(id){
               for (var i = 0; i < scope.selectedItems.length; i++){
                  if (scope.selectedItems[i] == id){
                     return i;
                  }
                }
                
                return null;
           };
           
        
           scope.markSelected = function(id){
               //console.log('MARKING SELECED ==> ' + id);
                 if (scope.selectedItems.length > 0){
                   var index = getSelectedItemIndex(id);
                   if (index !== null){
                      if (scope.selectedItems.length === 1){
                         scope.selectedItems = [];
                         selectionService.clear();
                         scope.totalSelected = 0;
                                               
                         return;
                       }else {
                         scope.selectedItems.splice(index, 1);
                         selectionService.remove(id);
                         scope.totalSelected--;
                        // $rootScope.$broadcast('imageDeselected',{index: index});
                         return;
                       }
                  }
                }
                
                scope.selectedItems.push(id);
                scope.totalSelected++;
                //scope.$apply();
                
                
                
                var selectedImageObj = _.find(scope.thumbnails, function(image){
                    return image.id === id;
                });
                
                selectionService.add(selectedImageObj);                    
            };
                   
           scope.showSlideshow = function(pid){
               var pswpElement = document.querySelectorAll('.pswp')[0];
               var items = [];
               var currIndex = 0;
               var currEl = null;
               
               for (var i = 0; i < scope.thumbnails.length; i++){
                   var currThumb = scope.thumbnails[i];
                   var el = getElement(currThumb.id);
                   
                   var item = {
                       src: currThumb.photoURL,
                       msrc: currThumb.photoURL,
                       pid: currThumb.id,
                       el: el,
                       w: currThumb.width,
                       h: currThumb.height
                   };

                   items.push(item);
               }
               
               for (var g = 0; g < items.length; g++){
                   if (items[g].pid === pid){
                       currIndex = g;
                       break;
                   }
               }
               
               var options = getOptions(items);
               options.index = currIndex;
               
               var gallery = new PhotoSwipe(pswpElement, false, items, options);
                          
               gallery.init();

           };   
			
			var getFullLibrary = function(){
			console.log('getting full lib.....');
			
				cordova.plugins.photoLibrary.requestAuthorization(function () {
					cordova.plugins.photoLibrary.getLibrary(function (result) {
						console.log('DIRECTIVE -- getFullLibrary setting fullLibrary to total of: ' + result.library.length);
                        scope.thumbnails = result.library;//.slice(1, 40);
                        scope.totalPhotos = result.library.length;
						 
           fileService.init(result.library);
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

				scope.thumbnailLimit += itemsPerLoad;
              //  $rootScope.$emit('lazyImg:refresh');
				scope.$apply();
				loading = false;
                
              //  }, 100);
			});
		},   
        template: '<div style="display: inline; position: relative;" ng-repeat="item in thumbnails | orderBy: \'-creationDate\' | limitTo: thumbnailLimit track by item.id"><img ng-click="markSelected(item.id)" width="75" style="display: inline; position: relative;" id="{{item.id}}" ng-src="{{item.thumbnailURL}}" />	<i ng-if="isSelected(item.id)" class="f7-icons color-green" style="position: absolute; top: 0; right: 4px; display:inline; font-size: 14px;">check_round_fill</i></div><div class="infinite-scroll-preloader">	<div class="preloader"></div></div>'                                  
	}
}]);
