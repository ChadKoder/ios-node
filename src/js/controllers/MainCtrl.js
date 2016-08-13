/*
 * controllers v  (build 20160812_173517_1)
 * 2016
 * Author: Chad Keibler 
 */

//js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window', '$http', '$mdToast', '$sce', '$scope',
	function ($window, $http, $mdToast, $sce, $scope) {
	var port = ':8888';
	var vm = this;
	vm.ipAddress = 'http://192.168.1.109';
	vm.username = 'Chad';
	vm.password = 'pass';
    vm.inProgress = false;
    vm.selectedMedia = 'image';
    vm.mediaSelectText = 'Selecting Photos';
    
  //  vm.lfNgMdFileInputPhotosTemplate = $sce.trustAsHtml('<lf-ng-md-file-input id="lfNgMdFileInputBtn" ng-disabled="!vm.username || !vm.password" preview multiple accept="image/*" lf-files="vm.files" filecount lf-browse-label="Select Photos"></lf-ng-md-file-input>');
                                                       
  //  vm.lfNgMdFileInputVideoTemplate = $sce.trustAsHtml('<lf-ng-md-file-input id="lfNgMdFileInputBtn" ng-disabled="!vm.username || !vm.password" preview accept="video/*" lf-files="vm.files" filecount lf-browse-label="Select Video"></lf-ng-md-file-input>');
    
     
    vm.refresh = function () {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    
    vm.toggleSelectedMedia = function() {
        var elButton = document.getElementById('lfNgMdFileInputBtn');
            if (vm.selectedMedia === 'image') {
               vm.selectedMedia = 'video';
               vm.mediaSelectText = 'Selecting Video';
              // vm.lfNgMdInputModel = $sce.trustAsHtml(lfNgMdFileInputVideoTemplate);
             elButton.removeAttribute('multiple');
        } else {
                                                       
            vm.selectedMedia = 'image';
            vm.mediaSelectText = 'Selecting Photos';
             elButton.setAttribute('multiple', '');
            // vm.lfNgMdInputModel = $sce.trustAsHtml(lfNgMdFileInputPhotosTemplate);
            
        }
        
        vm.refresh();
    };
    
    
    
   // vm.lfNgMdInputModel = lfNgMdFileInputVideoTemplate;
	
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
    
 /*   vm.mediaSelectText = function () {
       // var elButton = document.getElementById('lfNgMdFileInputBtn');
        if (vm.selectedMedia === 'image') {
          //  elButton.setAttribute('multiple', '');
            return 'Select Photos';
        } else {
          // elButton.removeAttribute('multiple');
            return 'Select Video';
        }
    };*/
	
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
    
   //  vm.refresh();
}]);