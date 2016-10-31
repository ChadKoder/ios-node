angular.module('dash-client').controller('ContactsCtrl', ['httpService', '$window',
	function (httpService, $window) {
		var vm = this;
		vm.contacts = [];
		vm.serverContacts = [];
		
		vm.contactsSuccess = function(contacts) {
			alert('total contacts: ' + contacts.length);
			vm.contacts = contacts;
		};
		
		vm.contactsFailure = function(err){
			alert('Error retrieving contacts: ' + err);
		};
		
		vm.deleteContacts = function () {
			if(!$window.confirm('Delete ALL contacts?')){
				alert( 'Delete All Canceled!');
				return;
			}
			
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
		
		
		
		vm.saveContacts = function (){
			if(!$window.confirm('save contacts to server?')){
				alert( 'Save contacts canceled!');
				return;
			}
			httpService.post('/contacts', vm.contacts).then(function (res){
				alert('saved contacts!!!!');
			}, function (err){
				alert('error saving contacts---> ' + err);
			});
		};
		
		vm.restoreContactsFromServer = function(){
			if(!$window.confirm('Restore contacts from server?')){
				alert( 'Restore all Canceled!');
				return;
			}
			alert('restoring contacts...');
			httpService.get('/contacts').then(function (res) {
				vm.serverContacts = res.data;
			
			   vm.missing = [];
			   
			   for (var i =0; i < vm.serverContacts.length; i++){
				   if (vm.contacts.length > 0){

						   var index = _.findIndex(vm.contacts, function (c) {
							   return c.name.formatted == vm.serverContacts[i].name.formatted;
							});
						   
						   if (index === -1){
								console.log('adding NOT FOUNND contact');
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
		};
		
		vm.getSettings = function(){
			
		};
		
		vm.init = function(){
			vm.getSettings();
		};
	
}]);