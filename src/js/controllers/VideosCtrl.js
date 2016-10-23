angular.module('dash-client')
.controller('VideosCtrl', [
function () {
	var vm = this;
	
	vm.videos = [];
	vm.submit = function (){
			if (!vm.username || !vm.password) {
				vm.showErrorToast('username and password are required.');
				return;
			}

			var encodedAuth = btoa(vm.username + ':' + vm.password);
			var formData = new FormData();
			formData.enctype = "multipart/form-data";
			
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
}]);