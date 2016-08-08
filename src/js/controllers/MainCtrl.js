//js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window', '$http', '$mdToast',
	function ($window, $http, $mdToast) {
	var port = ':8888';
	var vm = this;
	vm.ipAddress = 'http://192.168.1.109';
	
	vm.submit = function (){
		var formData = new FormData();
		formData.enctype = "multipart/form-data";

		angular.forEach(vm.files, function (obj) {
			formData.append('file', obj.lfFile);
		});
		
		var encodedAuth = btoa('Chad:pass');
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;

		$http.post(vm.ipAddress + port, formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(function(result) {
			alert('success...');
		}, function (err) {
			//alert('HttpStatus ---> ' + err.status);
			alert('error: ' + JSON.stringify(err));
		});
	};
	
	vm.success = function(){
		alert('upload successful');
	};

	vm.failure = function() {
		alert('upload failed');
	};
	
	vm.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
	};
}]);