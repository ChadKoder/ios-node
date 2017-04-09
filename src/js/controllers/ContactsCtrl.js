PhotoDash.angular.controller('ContactsCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
	var vm = this;
	var app = PhotoDash.fw7.app;
	
	vm.contactsSuccess = function(contacts) {
		vm.contacts = contacts;
		$scope.$apply();
	};
	
	vm.uploadContacts = function(){
		app.confirm('Upload ' + vm.contacts.length + ' contacts to your PC? This will overwrite your previous contacts backup.', function (){
			$http.post('http://192.168.1.109:8888' + '/contacts', vm.contacts).then(function (res){
				app.alert('saved contacts to PC successfully!');
			}, function (err){
				app.alert('error saving contacts---> ' + err);
			});
		});
	};
	
	vm.contactsFailure = function(err){
		if (parseInt(err.code) === 20){
			app.alert('Privacy settings are disabled for contacts for this application.');
		}
		app.alert('Error retrieving contacts: ' + err);
	};
	
	vm.getContacts = function(){
		var options = new ContactFindOptions();
		options.filter = '';
		options.multiple = true;
		var filter = ["displayName", "addresses"];
		navigator.contacts.find(filter, vm.contactsSuccess, vm.contactsFailure, options);
	};
	
	vm.init = function(){
		vm.getContacts();
	};
	
	vm.init();
}]);
