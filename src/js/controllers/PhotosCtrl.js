
angular.module('dash-client')
.controller('PhotosCtrl', ['$http', '$mdToast', '$scope', '_',
	function ($http, $mdToast, $scope, _) {
	var port = ':8888';
	var vm = this;
	vm.ipAddress = '';
	vm.username = '';
	vm.password = '';
	vm.uploadDir = '';
	vm.photos = [];
	
    vm.getInfo = function(){
        alert('get info!');
    }

	vm.getSettings = function (){
		var localStorage = window.localStorage;
		
		vm.uploadDir = localStorage.getItem('uploadDir');
		vm.albumName = localStorage.getItem('albumName');
		vm.ipAddress = localStorage.getItem('ipAddress');
		var cred = localStorage.getItem('credentials');
		var credString = atob(cred);
		var creds = credString.split(':');
		vm.username = creds[0];
		vm.password = creds[1];

		if (vm.ipAddress && vm.username && vm.password) {
			vm.serverSettings = true;
			vm.editSettingsText = 'Edit';
		} else {
			vm.serverSettings = false;
			vm.editSettingsText = 'Show';
		}
	};
    
    vm.clearAlbum = function(){
        vm.photos = [];
    }

	vm.showErrorToast = function (err) {
		vm.showSimpleToast(err);
	};

	vm.showSuccessToast = function (msg) {
		vm.showSimpleToast(msg);
	};	
   
	vm.submit = function (){
		if (!vm.username || !vm.password) {
			vm.showErrorToast('username and password are required.');
			return;
		}

		var encodedAuth = btoa(vm.username + ':' + vm.password);
		var formData = new FormData();
		formData.enctype = "multipart/form-data";

		angular.forEach(vm.photos, function (obj) {
			formData.append('file', obj.file);
		});
		
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
		vm.inProgress = true;

		$http.post(vm.ipAddress + port + '/files', formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
			}).then(function(result) {
				vm.inProgress = false;
				vm.showSuccessToast('Album upload successful!');
			}, function (err) {
				alert('err: ' + JSON.stringify(err));
				var errorStatus = err.status.toString().trim();
				vm.inProgress = false;
				switch (errorStatus) {
					case '401':
						vm.showErrorToast('username/password validate failed.');
						vm.username = '';
						vm.password = '';
						break;
					case '-1':
						vm.showErrorToast('Server is not available.');
						break;
					default:
						vm.showErrorToast('Unknown error.');
						break;
				}
		});
	};

	vm.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
	};

	 vm.photoItems = [];

    vm.showGallery = function (pid){
		var index = 0;
        vm.photoItems = [];
		        
        var figureEls = document.getElementsByTagName('figure');
        var orientation = null;
        var src = null;
        var item = {};
        
		
           for (var p = 0; p < vm.photos.length; p++){
			  // console.log('looking up pid->' + pid);
               if (vm.photos[p].pid === pid){
				   //alert('Found item with pid:' + pid);
				   index = p;
             
			       console.log('photo' + p + ' + has pid-->' + vm.photos[p].pid);
                   orientation = vm.photos[p].orientation;
                   
                   item.el = figureEls[p];
                   item.src = vm.photos[p].src;
                   item.pid = vm.photos[p].pid;
                   item.msrc= vm.photos[p].src;
                   
                   item.w= vm.photos[p].width;
                   item.h=  vm.photos[p].height;
                   
                   if (orientation === 6){
                       if (parseInt(item.w) > parseInt(item.h)){
                           item.w = vm.photos[p].height;
                           item.h = vm.photos[p].width;
                           
                       }
                   }
                           
                   break;
               }
           }
            //console.log('ITEM #' + pid + ' WIDTH->' + item.w + ' HEIGHT->' + item.h);
            vm.photoItems.push(item);
          
        
		require([
		'./js/photoswipe.js',
		'./js/photoswipe-ui-default.js'
		], function(PhotoSwipe, PhotoSwipeUI_Default) {
			var pswpElement = document.querySelectorAll('.pswp')[0];

			// define options (if needed)
			var options = {
				index: index,
				//history: false,
				barsSize: {top:250, bottom: 'auto'},
				getThumbBoundsFn: function(thumbIndex){
                    var thumbnail = vm.photoItems[thumbIndex].el.getElementsByTagName('img')[0];
                    var rect = thumbnail.getBoundingClientRect();
                      var body = document.body;
                      var docElem = document.documentElement;
                    /*TODO: CLEAN THIS UP!!!*/
                      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
                      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
                      var clientTop = docElem.clientTop || body.clientTop || 0;
                      var clientLeft = docElem.clientLeft || body.clientLeft || 0;
                
                      var top = thumbnail.top + scrollTop - clientTop;
                      var left = thumbnail.left + scrollLeft - clientLeft;
                      var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
				},
				showAnimationDuration: 2
			};
    
            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, vm.photoItems, options);
			gallery.init();
			});
	};
    
	vm.getSettings();

}]);