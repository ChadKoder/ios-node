//js/controllers/MainCtrl.js
angular.module('dash-client', []).controller('MainCtrl', ['$window', '$http', '$mdToast', '$scope', '$timeout',
	function ($window, $http, $mdToast, $scope, $timeout) {
	var port = ':8888';
	var vm = this;
	vm.ipAddress = '';
	vm.username = '';
	vm.password = '';
	vm.uploadDir = '';
	vm.inProgress = false;
	vm.selectedMedia = 'image';
	vm.serverSettings = false;
	vm.editSettingsText = 'Hide';
	 
	
	vm.openDialog = function (e, el){
		if(e){
			$timeout(function(){
				e.preventDefault();
				e.stopPropagation();
				var elInput = e.target.children[2];
				if (elInput !== undefined){
					elInput.click();
				}
			}, 0);
		}
	};
    
	vm.setDeviceName = function () {
		vm.deviceName = cordova.plugins.deviceName.name;
		vm.refresh();
	};
	
	document.addEventListener("deviceready", vm.setDeviceName, false);
	
	vm.editSettings = function () {
		alert('settings...');
	};
    
    vm.viewImage = function () {
        alert('controller viewimage!');
    };
    
    vm.mediaSelectText = 'Select ' + vm.selectedMedia;
    
	vm.toggleServerSettings = function (){
		if (vm.serverSettings){
			vm.serverSettings = false;
			vm.editSettingsText = 'Hide';
		} else {
			vm.editSettingsText = 'Edit';
			vm.serverSettings = true;
		}
	};
    
    

	vm.refresh = function () {
		if (!$scope.$$phase) {
			$scope.$apply();
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

	vm.showPreview = function () {
		var elButton = document.getElementById('lfNgMdFileInputBtn');
		elButton.setAttribute('preview','');
	};
	
	vm.deleteSettings = function () {
		$http.delete(vm.ipAddress + port + '/settings').then(function (res) {
			alert('successfully cleared your settings.');
		}, function (err){
			alert('error deleting settings: ' + err);
		});
	};
	
	vm.getSettingsFromServer = function() {
		$http.get(vm.ipAddress + port + '/settings').then(function (res) {
			alert(JSON.stringify(res));
		}, function (err){
			alert('error: ' + err);
		});
		
	};

	vm.saveSettings = function (){
		
		vm.inProgress = true;
		var credentials = btoa(vm.username + ':' + vm.password);
		var localStorage = window.localStorage;
		var settings = {
			ipAddress: vm.ipAddress,
			deviceName: vm.deviceName,
			credentials: credentials,
			uploadDir: vm.uploadDir,
			albumName: vm.albumName
		}
		
		$http.post(vm.ipAddress + port + '/settings', JSON.stringify(settings))
			.then(function(result) {
				localStorage.setItem('ipAddress', vm.ipAddress);
				localStorage.setItem('credentials', credentials);
				localStorage.setItem('uploadDir', vm.uploadDir);
				//localStorage.setItem('deviceName', vm.deviceName);
				localStorage.setItem('albumName', vm.albumName);
				alert('settings saved to server and to device');
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

	angular.forEach(vm.files, function (obj) {
		formData.append('file', obj.lfFile);
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