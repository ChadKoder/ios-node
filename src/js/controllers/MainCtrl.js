angular.module('dash-client', []).controller('MainCtrl', ['$http', '$mdToast', '$scope', '_',
	function ($http, $mdToast, $scope, _) {
		var port = ':8888';
		var vm = this;
		vm.ipAddress = '';
		vm.username = '';
		vm.password = '';
		vm.uploadDir = '';
		vm.showSettings = false;
		vm.serverSettings = false;
		$scope.items = [];
		vm.photos = [];
		$scope.testitems = [];
		vm.totalRestored = 0;
		vm.contacts = [];
		
		
		vm.contactsSuccess = function(contacts) {
			alert('total contacts: ' + contacts.length);
			vm.contacts = contacts;
		};
		
		vm.contactsFailure = function(err){
			alert('Error retrieving contacts: ' + err);
		};
		
		vm.deleteContacts = function () {
			for (var i = 0; i < vm.contacts.length; i++){
				vm.contacts[i].remove(function(){
					console.log('removing contact...');
					
				}, function (err){
					console.log('error deleing contacts');
				});
			}
		};
		
		
		vm.getContacts = function() {
			//alert('getting contacts');
			var options = new ContactFindOptions();
			options.filter = "";
			options.multiple = true;
			var filter = ["displayName", "addresses"];
			navigator.contacts.find(filter, vm.contactsSuccess, vm.contactsFailure, options);
		   
		};
		
		vm.saveContacts = function (){
			localStorage.setItem('ipAddress', vm.ipAddress);
			localStorage.setItem('credentials', credentials);
			localStorage.setItem('uploadDir', vm.uploadDir);
			//localStorage.setItem('deviceName', vm.deviceName);
			localStorage.setItem('albumName', vm.albumName);
			$http.post(vm.ipAddress + port + '/contacts', JSON.stringify(vm.contacts))
				.then(function(result) {
				  //alert('saved contacts!');
					/*localStorage.setItem('ipAddress', vm.ipAddress);
					 localStorage.setItem('credentials', credentials);
					 localStorage.setItem('uploadDir', vm.uploadDir);
					 //localStorage.setItem('deviceName', vm.deviceName);
					 localStorage.setItem('albumName', vm.albumName);
					 alert('settings saved to server and to device');*/
					vm.inProgress = false;
			}, function (err) {
				vm.inProgress = false;
				alert('error: ' + err);
			});  
		};
		
		$scope.$watch('items.length', function() {
			if($scope.items.length === vm.photos.length){
				 //alert($scope.items[0].w);
			}
		});
		
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
 
		vm.getInfo = function(){
			alert('get info!');
		}
			
		vm.openSettings = function ($mdOpenMenu, e){
		// originatorEvent = e;
			$mdOpenMenu(e);
		};
		
		vm.toggleServerSettings = function (){
			var test = document.querySelector('.settings-container');
			test.classList.toggle('active');
			if (vm.showSettings){
				vm.showSettings = false;
			} else {
				vm.showSettings = true;
			}
		};

		vm.getSettings = function (){
			var localStorage = window.localStorage;
			//vm.deviceName = localStorage.getItem('deviceName');
			
			/*if (!vm.deviceName){
				alert('Enter a device name to continue...');
				return;
			}		*/
			
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
		
		/*vm.deleteSettings = function () {
			$http.delete(vm.ipAddress + port + '/settings').then(function (res) {
				alert('successfully cleared your settings.');
			}, function (err){
				alert('error deleting settings: ' + err);
			});
		};*/
		
		/*
		vm.getSettingsFromServer = function() {
			$http.get(vm.ipAddress + port + '/settings').then(function (res) {
				alert(JSON.stringify(res));
			}, function (err){
				alert('error: ' + err);
			});
			
		};*/
		
		vm.serverContacts = [];
		
	   
		vm.sleep = function(length) {
			return new Promise(function (resolve, reject) {
				setTimeout(resolve, length);
			});
		};
	   
		vm.restoreContactsFromServer = function(){
			//get contacts from server
			 $http.get(vm.ipAddress + port + '/contacts').then(function (res){
				vm.serverContacts = res.data;
								 
			   vm.missing = [];
			   
			   for (var i =0; i < vm.serverContacts.length; i++){
				   if (vm.contacts.length > 0){

						   var index = _.findIndex(vm.contacts, function (c) {
							   return c.name.formatted == vm.serverContacts[i].name.formatted;
							});
						   
						   if (index === -1){
								console.log('adding NOT FOUNND contact');
							   var contact = navigator.contacts.create(vm.serverContacts[i]);

							   vm.missing.push(contact);
						   }
					 } else {
						var contact = navigator.contacts.create(vm.serverContacts[i]);
						   console.log('adding ALL contact...');
						 vm.missing.push(contact);
					}
				}
				
				var ctr = 0;
				 vm.totalRestored = ctr;
				
				function saveAllContacts(ctr, contacts){
					var c = contacts[ctr];
					c.save(function(){
						console.log('saved ' + ctr);
						ctr++;
						 if (ctr < vm.missing.length){
							 saveAllContacts(ctr, vm.missing);
						 } else {
							 
							 console.log('saved all ' + ctr + ' contacts!');
						 }
						}, function(err){
							console.log('error!');
					}); 
					}
					
					saveAllContacts(ctr, vm.missing);
					
					 
				});
		};
		
		vm.saveSettings = function (){
			//vm.inProgress = true;
			var credentials = btoa(vm.username + ':' + vm.password);
			var localStorage = window.localStorage;
			var settings = {
				ipAddress: vm.ipAddress,
				deviceName: vm.deviceName,
				credentials: credentials,
				uploadDir: vm.uploadDir,
				albumName: vm.albumName
			}
			
			localStorage.setItem('ipAddress', vm.ipAddress);
			localStorage.setItem('credentials', credentials);
			localStorage.setItem('uploadDir', vm.uploadDir); 
			localStorage.setItem('albumName', vm.albumName);
			
			$http.post(vm.ipAddress + port + '/settings', JSON.stringify(settings))
				.then(function(result) {
					vm.inProgress = false;
				}, function (err) {
					vm.inProgress = false;
					alert('error: ' + err);
			});
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
			
			angular.forEach(vm.videos, function (obj) {
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

		vm.getSettings();

}]);