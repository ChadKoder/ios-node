angular.module('dash-client').factory('dialogService', ['$mdDialog',
    function ($mdDialog) {
		function DialogService() {
			var self = this;
			
			self.showConfirm = function (title, content, label, okText, cancelText, ev){
				// Appending dialog to document.body to cover sidenav in docs app
				var confirm = $mdDialog.confirm()
					.title(title)
					.textContent(content)
					.ariaLabel(label)
					.targetEvent(ev)
					.ok(okText)
					.cancel(cancelText);
					
					return new Promise(function(resolve, reject){
						$mdDialog.show(confirm).then(function() {
						  resolve(true);
						}, function() {
							reject('User canceled save');
						});
					});
			};
			
			self.showAlert = function (title, textContent, btnText, e){
				var alert = $mdDialog.alert()
					//.clickOutsideToClose(true)
					.title(title)
					.textContent(textContent)
					//.ariaLabel('Success Dialog')
					.ok(btnText)
					.targetEvent(e);
					
					return new Promise(function(resolve, reject){
						$mdDialog.show(alert).then(function() {
						  resolve(true);
						}, function() {
							reject('User canceled save');
						});
					});
				
			};
		}
		
		return new DialogService();
	}
]);