//js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window', '$http', '$mdToast', '$sce', '$scope',
	function ($window, $http, $mdToast, $sce, $scope) {
		var port = ':8888';
		var vm = this;
		vm.ipAddress = '';
		vm.username = '';
		vm.password = '';
		vm.inProgress = false;
		vm.selectedMedia = 'image';

	vm.mediaSelectText = 'Selecting Photos';

	vm.refresh = function () {
		if (!$scope.$$phase) {
			$scope.$apply();
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

		$http.post(vm.ipAddress + port, formData, {
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
	
}]);