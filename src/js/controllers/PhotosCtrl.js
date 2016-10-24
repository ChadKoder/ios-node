angular.module('dash-client').controller('PhotosCtrl', ['$scope', '$mdToast', 'httpService',
	function ($scope, $mdToast, $http) {
		var vm = this;
		
		vm.photos = [];
		/*$scope.items = [];
		$scope.$watch('items.length', function() {
			if($scope.items.length === vm.photos.length){
				 //alert($scope.items[0].w);
			}
		});
		*/
		$scope.$watch('vm.photos.length', function(i) {
		  for (var y=0; y < vm.photos.length; y++){  
				var img = new Image;  
				img.src = vm.photos[y].dataUrl;
				
				img.onload = function() { 
					var item = {
						src: img.src,
						w: img.width,
						h: img.height,
						pid: 'photo' + Math.random()
					};
					
					$scope.items.push(item);
				};
			}
		});
		
		vm.showSimpleToast = function (msg){
			$mdToast.showSimple(msg);
		};
		
		vm.showErrorToast = function (err) {
			vm.showSimpleToast(err);
		};

		vm.showSuccessToast = function (msg) {
			vm.showSimpleToast(msg);
		};
		
		vm.showGallery = function (){
			require([ 
			'./js/photoswipe.js', 
			'./js/photoswipe-ui-default.js' 
			], 
			function(PhotoSwipe, PhotoSwipeUI_Default) {
				var pswpElement = document.querySelectorAll('.pswp')[0];
				// define options (if needed)
				var options = {
						 // history & focus options are disabled on CodePen  
					index: 0,
					history: false,
				  //  barsSize: {top:15, bottom:350},
					focus: false,
					//fullscreenEl: false,
					showAnimationDuration: 0,
					hideAnimationDuration: 0,
					addCaptionHTMLFn: function (item, captionEl, isFake) {
						if (!item.title){
							captionEl.children[0].innerHTML = 'no title';
							return false;
						}
						
					//    captionEl.children[0].innerHTML = item.title;
						
						captionEl.children[0].innerHTML = 'BLAH!';
						return true;
					},
					closeEl: true,
					captionEl: true,
					zoomEl: true
				};

				var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, $scope.items, options);
				gallery.init();

			});
		};
		
		vm.submit = function (){
			alert('submitting...');
			 var ip = localStorage.getItem('ipAddress');
			var creds = localStorage.getItem('credentials');
			var uploadDir = localStorage.getItem('uploadDir');
			 var albumName = localStorage.getItem('albumName');
			var credString = atob(creds);
			alert('credsString: ' + credString);
			var credsSplit = credString.split(':');
		
			if (credsSplit) {
				var userName = credsSplit[0];
				var pass = credsSplit[1];
				
				 if (!userName || !pass) {
					vm.showErrorToast('username and password are required.');
					return;
				}

				var encodedAuth = btoa(userName + ':' + pass);
				var formData = new FormData();
				formData.enctype = "multipart/form-data";

				angular.forEach(vm.photos, function (obj) {
					formData.append('file', obj.file);
				});
				
				angular.forEach(vm.videos, function (obj) {
					formData.append('file', obj.file);
				});

				$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
				vm.inProgress = true;
					
				httpService.post('/files', formData,{
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
				
			} else {
				alert('no creds! returning...');
				return;
			}
			              

		};
		
	}]);