angular.module('dash-client')
.controller('PhotosCtrl', ['$http', '$mdToast', '$scope', '_',
	function ($http, $mdToast, $scope, _) {
	var port = ':8888';
	var vm = this;
	vm.ipAddress = '';
	vm.username = '';
	vm.password = '';
	vm.uploadDir = ''; 
    $scope.items = [];
    vm.photos = [];
    $scope.testitems = [];
    vm.totalRestored = 0;
    
    $scope.$watch('items.length', function() {
        if($scope.items.length === vm.photos.length){
        }
    });
	
    $scope.$watch('vm.photos.length', function(i) {
        //if (i){
            
                  //alert(i);
                  //alert('test i : ' + i);
                  // alert('MAINCTRL! ' + vm.photos.length);
                  //var fr = new FileReader;
                  //fr.onload = function() {
                  
                  //alert(vm.photos.length);
                  
                  for (var y=0; y < vm.photos.length; y++){
                  
                      var img = new Image;
                      
                      img.src = vm.photos[y].dataUrl;
                      
                      img.onload = function() {
                          //alert(img.width);
                          
                          // alert('scope photos: ' + i);
                          var item = {
                              src: img.src,
                              w: img.width,
                              h: img.height,
                              pid: 'photo' + Math.random()
                          };
                          
                          $scope.items.push(item);
                          
                      };

                  }
                                  
                  // img.src = $scope.photos[i].dataUrl;
                  
                  
           // }
       
                  });
                  
                  
   // var originatorEvent;
    
    vm.getInfo = function(){
        alert('get info!');
    }

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

	vm.getSettings();

}]);