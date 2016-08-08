//js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window', '$http', '$mdToast',
	function ($window, $http, $mdToast) {
	var port = ':8888';
	var vm = this;
	vm.ipAddress = 'http://192.168.1.109';
	vm.username = '';
	vm.password = '';
	
	vm.showErrorToast = function (err) {
		vm.showSimpleToast('error: ' + err);
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

		angular.forEach(vm.files, function (obj) {
			formData.append('file', obj.lfFile);
		});
		
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;

		$http.post(vm.ipAddress + port, formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(function(result) {
			vm.showSuccessToast('Album upload successful!');
		}, function (err) {
			//alert('HttpStatus ---> ' + err.status);
			vm.showErrorToast('error: ' + JSON.stringify(err));
		});
	};
	
	vm.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
	};
}]);