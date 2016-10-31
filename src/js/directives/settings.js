angular.module('dash-client').directive('settings', ['$http', function ($http) {
	  var port = ':8888';
    
	return {
        require: '?ngModel',
		restrict: 'E',
		templateUrl: './views/settings.html',
		replace: true,
         bindToController: {
         saveSettings: '&',
		 getSettings: '&'
         },
         controller: 'TopbarCtrl',
         controllerAs: 'vm',       
		link: function (scope, element, attrs, ngModel) {                         
			scope.openSettings = function ($mdOpenMenu, e){
				$mdOpenMenu(e);
			};
			
            scope.saveSettings = function (){
            //alert('save settingsDIR');
           // alert('saving from settings Directive!');
            
             //scope.inProgress = true;
             var credentials = btoa(scope.username + ':' + scope.password);
             var localStorage = window.localStorage;
             var settings = {
                 ipAddress: scope.ipAddress,
                 //	deviceName: vm.deviceName,
                 credentials: credentials,
                 uploadDir: scope.uploadDir,
                 albumName: scope.albumName
             }
             
             localStorage.setItem('ipAddress', scope.ipAddress);
             localStorage.setItem('credentials', credentials);
             localStorage.setItem('uploadDir', scope.uploadDir);
             localStorage.setItem('albumName', scope.albumName);
             
             $http.post(scope.ipAddress + port + '/settings', JSON.stringify(settings))
             .then(function(result) {
                  // vm.inProgress = false;
                   alert('settings saved!');
                   }, function (err) {
                  // vm.inProgress = false;
                   alert('error: ' + err);
                   });
             // alert('1111');
              // ngModel.saveSettings();
             // this.saveSettings();
             
            };
		}
	}
}]);