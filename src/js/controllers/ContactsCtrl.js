angular.module('dash-client').controller('ContactsCtrl', ['$http',
	function ($http) {
		var port = ':8888';
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
		
		vm.getContacts = function() {
			//alert('getting contacts');
			var options = new ContactFindOptions();
			options.filter = "";
			options.multiple = true;
			var filter = ["displayName", "addresses"];
			navigator.contacts.find(filter, vm.contactsSuccess, vm.contactsFailure, options);
		   
		};
		
		vm.saveContacts = function (){
			alert('saving contacts...');
			$http.post(vm.ipAddress + port + '/contacts', JSON.stringify(vm.contacts))
				.then(function(result) {
					alert('saved contacts');
				 
			}, function (err) {
				vm.inProgress = false;
				alert('error saving contacts: ' + err);
			});  
		};
		
		vm.restoreContactsFromServer = function(){
			alert('restoring contacts...');
			//get contacts from server
			 $http.get(vm.ipAddress + port + '/contacts').then(function (res){
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