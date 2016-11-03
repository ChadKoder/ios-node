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
						  //$scope.status = 'You decided to get rid of your debt.';
						  //alert('moving on!!');
						  resolve(true);
						}, function() {
							reject('User canceled save');
							//alert('Canceled!');
						  //$scope.status = 'You decided to keep your debt.';
						});
					});

					
			};
		}
		
		return new DialogService();
	}
]);