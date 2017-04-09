PhotoDash.angular.directive('popupPhotoAlbum', ['_',
function (_) {
	  return {
            scope: {
                items: '='
            },
            templateUrl: 'popup-photo-album.html',
            replace: true,
			link: function (scope, el, attrs, ctrl){
				scope.limit = 200;
				var psItems = [];
				//scope.items = {};
				
				var getElement = function(id){
					var imageEls = document.getElementById('popup-photo-album').getElementsByTagName('img');
				   
				   for (var i = 0; i < imageEls.length; i++){
					   var imageEl = imageEls[i];
					   var imagepid = imageEl.getAttribute('id');
					      
					   if (id === imagepid){
							return imageEl;
						   break;
					   }
				   }
			   };
				
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
				
				scope.viewSlideshow = function(id){
					var pswpElement = document.querySelectorAll('.pswp')[0];
					
					if (psItems.length === 0){
						//Load photoswipe items from libraryItems
						var currIndex = 0;
						var currEl;
						
						for (var i = 0; i < scope.items.libraryItems.length; i++){
						   var currLibraryItem = scope.items.libraryItems[i];
						   var el = getElement(currLibraryItem.id);
						   
						   var item = {
							   src: currLibraryItem.photoURL,
							   msrc: currLibraryItem.photoURL,
							   pid: currLibraryItem.id,
							   el: el,
							   w: currLibraryItem.width,
							   h: currLibraryItem.height
						   };
						   
						   psItems.push(item);
					   }
					
					}
					
					
				   
				   for (var g = 0; g < psItems.length; g++){
					   if (psItems[g].pid === id){						
						   currIndex = g;
						   break;
					   }
				   }
               
				   var options = getOptions(psItems);
				   options.index = currIndex;
				   
				   var gallery = new PhotoSwipe(pswpElement, false, psItems, options);
				
				   gallery.init();
						
				};
				
				
				
				scope.closePopup = function(){
					PhotoDash.fw7.app.closeModal();
				};			
			}
           // controller: 'PhotosCtrl',
           // controllerAs: 'ctrl'
        };
}]);