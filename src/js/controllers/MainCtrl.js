//js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window', '$http', '$mdToast',
	function ($window, $http, $mdToast) {
	var vm = this;

	vm.submit = function (){
		var formData = new FormData();
		formData.enctype = "multipart/form-data";

		angular.forEach(vm.files, function (obj) {
			formData.append('file', obj.lfFile);
		});

		$http.post('http://192.168.1.109:8888', formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(function(result) {
			alert('success...');
		}, function (err) {
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