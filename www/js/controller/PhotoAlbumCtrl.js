PhotoDash.angular.controller('PhotoAlbumCtrl', ['$scope', '$rootScope', '$compile', 'fileService', function($scope, $rootScope, $compile, fileService) {
    var vm = this;
    vm.library = [];
    var loading = false;
    var lastIndex = 0;
    var lastArrayIndex = 0;
    var itemsPerLoad = 100;
    vm.thumbnails = [];
    vm.totalPhotos = 0;
    vm.myLibrary = [];
    vm.thumbnailLimitTo = itemsPerLoad;
    
    vm.init = function(){
        
       // setTimeout(function(){
        //vm.totalPhotos = fileService.getTotalPhotos();
       // }, 1000);
    
    };

    vm.goBack = function(){
    mainView.router.back({url: 'photos.html', force: true});
    
    };
    //vm.init();
    
    vm.getImgElement = function(pid){
        var imageEls = document.querySelectorAll('img');
        
        for (var i = 0; i < imageEls.length; i++){
            var imageEl = imageEls[i];
            var imagepid = imageEl.getAttribute('id');
            if (pid === imagepid){
                return imageEl;
                break;
            }
        }
        
        return null;
    };
    
    vm.buildPhotoList = function(){
       // selectionService.buildPhotoList();
    };
    
  
                                                
    vm.getOptions = function(items){
        var options = {
        //   arrowEl: true,
        // tapToToggleControls: true,
        history: false,
        loop: true,
        timeToIdle: 4000,
        showHideOpacity: false,
        hideAnimationDuration: 333,
        bgOpacity: 1,
        spacing: 0.12,
        allowPanToNext: true,
        maxSpreadZoom: 2,
        pinchToClose: true,
        closeOnScroll: false,
        closeOnVerticalDrag: true,
        mouseUsed: false,
        escKey: false,
        arrowKeys: false,
        galleryPIDs: true,
        preload: [1,1],
        mainClass: "testClass1",
        focus: true,
        isClickableElement: function (el){
        return false;
        },
        modal: true,
        barsSize: {top:55, bottom: 'auto'},
        timeToIdleOutside: 1000,
        loadingIndicatorDelay: 1000,
        addCaptionHTMLFn: function (item, captionEl, isFake){
        captionEl.children[0].innerHTML = 'Caption Test1';
        return true;
        },
        closeEl: true,
        captionEl: true,
        fullscreenEl: true,
        zoomEl: true,
        shareEl: false,
        counterEl: true,
        arrowEl: true,
        preloaderEl: true,
        tapToClose: false,
        tapToToggleControls: true,
        clickToCloseNonZoomable: false,
        closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'],
        indexIndicatorSep: '/',

        getThumbBoundsFn: function(index){
        var thumbnail = items[index].el;
        var rect = thumbnail.getBoundingClientRect();
        var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        },
        showAnimationDuration: 2
        };

        return options;
    };
                                                
                                                

    /*
    $$('.page-content').on("scroll", function () {
        $rootScope.$emit('lazyImg:refresh');
    });*/
   

        function chunkArray(myArray, chunk_size){
            var index = 0;
            var arrayLength = myArray.length;
            var tempArray = [];
            
            for (index = 0; index < arrayLength; index += chunk_size) {
                myChunk = myArray.slice(index, index+chunk_size);
                // Do something if you want with the group
                tempArray.push(myChunk);
            }
            
            return tempArray;
        }
        
    }]);
