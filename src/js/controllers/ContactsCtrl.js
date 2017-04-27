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
	vm.deleteContacts = function (e) {
	PhotoDash.fw7.app.confirm('Are you sure?', 'Delete All Contacts',
      function () {
	  	vm.getContactsForDelete().then(function(res){
						var contacts = res;
						var errors = false;
						
						for (var i = 0; i < contacts.length; i++){
							contacts[i].remove(function(){
								console.log('removing contact...');
							}, function (err){
								errors = true;
								console.log('error deleing contacts');
								alert('error deleting contact #' + i);
							});
						}
						
						if (errors){
							alert('deletion completed WITH ERRORS! :(');
						} else {
							alert('deletion completed with NO errors!');
						}
						
					}, function (err){
						alert('delete contacts failed!');
					});

	});
			/*dialogService.showConfirm('Delete All Contacts', 'Delete ALL contacts from your device?', 'Delete Contacts', 'Yes', 'Cancel', e)
				.then(function(){
						vm.getContactsForDelete().then(function(res){
						var contacts = res;
						var errors = false;
						
						for (var i = 0; i < contacts.length; i++){
							contacts[i].remove(function(){
								console.log('removing contact...');
							}, function (err){
								errors = true;
								console.log('error deleing contacts');
								alert('error deleting contact #' + i);
							});
						}
						
						if (errors){
							alert('deletion completed WITH ERRORS! :(');
						} else {
							alert('deletion completed with NO errors!');
						}
						
					}, function (err){
						alert('delete contacts failed!');
					});
				}, function (err){
					alert(err);
				});*/
		};
		
		vm.getContactsForDelete = function (){
			return new Promise(function(resolve, reject){
				var options = new ContactFindOptions();
				options.filter = "";
				options.multiple = true;
				var filter = ["displayName", "addresses"];
				navigator.contacts.find(filter, 
					function (res){
						resolve(res);
					}, function (err){
						reject(err);
					}, options);
			});
		};
		
	vm.getContacts = function(){
		var options = new ContactFindOptions();
		options.filter = '';
		options.multiple = true;
		var filter = ["displayName", "addresses"];
		navigator.contacts.find(filter, vm.contactsSuccess, vm.contactsFailure, options);
	};
	
	vm.restoreContactsFromServer = function(e){
		
	  PhotoDash.fw7.app.confirm('Are you sure?', 'Restore Contacts',
      function () {
       // PhotoDash.fw7.app.alert('You clicked Ok button');
	    
	   $http.get('http://192.168.1.109:8888/contacts').then(function (res) {
							vm.serverContacts = res.data;
						
						   vm.missing = [];
						   
						   for (var i =0; i < vm.serverContacts.length; i++){
							   if (vm.contacts.length > 0){

									   var index = _.findIndex(vm.contacts, function (c) {
										   return c.name.formatted == vm.serverContacts[i].name.formatted;
										});
									   
									   if (index === -1){
											console.log('adding NOT FOUND contact');
										   var contact = navigator.contacts.create(vm.serverContacts[i]);

										   vm.missing.push(contact);
									   }
								 } else {
									var contact = navigator.contacts.create(vm.serverContacts[i]);
									   console.log('adding ALL contact...');
									 vm.missing.push(contact);
								}
							}
							
							var ctr = 0;
							 vm.totalRestored = ctr;
							
							function saveAllContacts(ctr, contacts){
								var c = contacts[ctr];
								c.save(function(){
									console.log('saved ' + ctr);
									ctr++;
									 if (ctr < vm.missing.length){
										 saveAllContacts(ctr, vm.missing);
									 } else {
										 
										 console.log('saved all ' + ctr + ' contacts!');
									 }
									}, function(err){
										console.log('error!');
								}); 
							}
							
							saveAllContacts(ctr, vm.missing);
						});
	   
      },
      function () {
        PhotoDash.fw7.app.alert('You clicked Cancel button');
      }
    );
	
	};
	
		/*dialogService.showConfirm('Restore contacts', 'Restore contacts from server?', 'Restore Contacts', 'Yes', 'Cancel', e)
			.then(function(){
				alert('Beginning to restore contacts...');
						httpService.get('/contacts').then(function (res) {
							vm.serverContacts = res.data;
						
						   vm.missing = [];
						   
						   for (var i =0; i < vm.serverContacts.length; i++){
							   if (vm.contacts.length > 0){

									   var index = _.findIndex(vm.contacts, function (c) {
										   return c.name.formatted == vm.serverContacts[i].name.formatted;
										});
									   
									   if (index === -1){
											console.log('adding NOT FOUND contact');
										   var contact = navigator.contacts.create(vm.serverContacts[i]);

										   vm.missing.push(contact);
									   }
								 } else {
									var contact = navigator.contacts.create(vm.serverContacts[i]);
									   console.log('adding ALL contact...');
									 vm.missing.push(contact);
								}
							}
							
							var ctr = 0;
							 vm.totalRestored = ctr;
							
							function saveAllContacts(ctr, contacts){
								var c = contacts[ctr];
								c.save(function(){
									console.log('saved ' + ctr);
									ctr++;
									 if (ctr < vm.missing.length){
										 saveAllContacts(ctr, vm.missing);
									 } else {
										 
										 console.log('saved all ' + ctr + ' contacts!');
									 }
									}, function(err){
										console.log('error!');
								}); 
							}
							
							saveAllContacts(ctr, vm.missing);
						});
			}, function (cancelReason){
				//alert(cancelReason);
		});
		
		 
	};*/

	vm.init = function(){
		vm.getContacts();
	};
	
	vm.init();
}]);
