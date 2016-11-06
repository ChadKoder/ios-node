angular.module('dash-client').controller('ContactsCtrl', ['httpService', '$scope', 'dialogService',
	function (httpService, $scope, dialogService) {
		var vm = this;
		vm.contacts = [];
		vm.serverContacts = [];
		
		vm.contactsSuccess = function(contacts) {
			vm.contacts = contacts;
			//if (!$scope.$$phase){
				$scope.$apply();
			//}
		};
		
		vm.backupIcon =  '/res/ic_file_upload.svg';
		vm.backupActionDesc = 'Backup ' + vm.contacts.length + ' contacts to your PC.';
		vm.backupWarningDesc = 'Warning: This will overwrite all previous backusp!';
		
		vm.restoreIcon =  '/res/ic_restore.svg';
		vm.restoreActionDesc = 'Restore all contacts from the server for this user.';
		vm.restoreWarningDesc = 'WARNING: This will overwrite ALL contacts on your device!';
		
		vm.deleteIcon =  '/res/ic_delete_forever.svg';
		vm.deleteActionDesc = 'Deletes ALL contacts from your device';
		vm.deleteWarningDesc = 'WARNING! You will lose all contacts';
		
		vm.contactsFailure = function(err){
			alert('Error retrieving contacts: ' + err);
		};
		
		vm.deleteContacts = function (e) {
			dialogService.showConfirm('Delete All Contacts', 'Delete ALL contacts from your device?', 'Delete Contacts', 'Yes', 'Cancel', e)
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
				});
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
		
		vm.getContacts = function() {
			var options = new ContactFindOptions();
			options.filter = "";
			options.multiple = true;
			var filter = ["displayName", "addresses"];
			navigator.contacts.find(filter, vm.contactsSuccess, vm.contactsFailure, options);
		};
		
		vm.saveContacts = function (e){
			dialogService.showConfirm('Save Contacts?', 'Save contacts to your PC?', 'Save Contacts', 'Yes', 'Cancel', e)
				.then(function(){
					httpService.post('/contacts', vm.contacts).then(function (res){
					alert('saved contacts!!!!');
					}, function (err){
						alert('error saving contacts---> ' + err);
					});
					 
				}, function (cancelReason){
					//alert(cancelReason);
			});
		};
		
		vm.restoreContactsFromServer = function(e){
			dialogService.showConfirm('Restore contacts', 'Restore contacts from server?', 'Restore Contacts', 'Yes', 'Cancel', e)
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
			
			 
		};
		
		 
		vm.init = function(){
			//vm.getSettings();
			vm.getContacts();
		};
		
		//vm.init();
	
}]);