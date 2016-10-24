angular.module('dash-client').factory('httpService', ['settingsService',
    '$http',
    function (settingsService, $http) {
		function HttpService() {
			var self = this;
			var port = ':8888';
			var settings = settingsService.getLocal();
			
			if (!settings){
				alert('no settings, returning!');
				return;
			}
			
			self.post = function (url, data, options){
				return new Promise (function (resolve, reject){
					
					//alert('post attempt...');
					$http.post(settings.ipAddress + port + url, 
					JSON.stringify(data), options)
					.then(function(result) {
						resolve(result);
					}, function (err) {
						reject(err);
					});
				});
			};
			
			self.get = function(url){
				return new Promise (function( resolve, reject){
					$http.get(settings.ipAddress + port + url)
					.then(function (result){
						resolve(result);
						//alert('got GET result...');
					}, function (err){
						reject(err);
						//alert('error on GET: ' + err);
					});
				});
				
			};
		}
		
		return new HttpService();
	}
]);