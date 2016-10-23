angular.module('dash-client')
.controller('TopbarCtrl', ['$location', '$http', '$scope',
function ($location, $http, $scope) {
	var port = ':8888';
	var vm = this;
	$scope.ipAddress = '';
	$scope.username = '';
	$scope.password = '';
	$scope.uploadDir = '';
	$scope.albumName = '';
	
	vm.go = function(url){
		$location.url(url);
	};
	/*
	vm.openSettings = function ($mdOpenMenu, e){
		$mdOpenMenu(e);
	};*/

	/*$scope.saveSettings = function (){
		alert('saving MAIN : --> ' + $scope.ipAddress);
		//scope.inProgress = true;
		var credentials = btoa($scope.username + ':' + $scope.password);
		var localStorage = window.localStorage;
		var settings = {
			ipAddress: $scope.ipAddress,
		//	deviceName: vm.deviceName,
			credentials: credentials,
			uploadDir: $scope.uploadDir,
			albumName: $scope.albumName
		}
		
		localStorage.setItem('ipAddress', $scope.ipAddress);
		localStorage.setItem('credentials', credentials);
		localStorage.setItem('uploadDir', $scope.uploadDir);
		localStorage.setItem('albumName', $scope.albumName);
		
		$http.post($scope.ipAddress + port + '/settings', JSON.stringify(settings))
			.then(function(result) {
				vm.inProgress = false;
				alert('settings saved!');
			}, function (err) {
				vm.inProgress = false;
				alert('error: ' + err);
		});
	};*/

}]);