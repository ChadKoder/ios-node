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
			
			self.post = function (url, auth, data, options){
				console.log('posting...');
				return new Promise (function (resolve, reject){
					$http.defaults.headers.common.Authorization = 'Basic ' + auth;
					$http.post(settings.ipAddress + port + url, JSON.stringify(data), options)
					.then(function(result) {
						console.log('POST SUCCESS...');
						resolve(result);
					}, function (err) {
						console.log('POST FAILURE: ' + JSON.stringify(err));
						reject(err);
					});
				});
			};
			
			self.get = function(url){
				return new Promise (function( resolve, reject){
					$http.get(settings.ipAddress + port + url)
					.then(function (result){
						resolve(result);
					}, function (err){
						reject(err);
					});
				});
			};
		}
		
		return new HttpService();
	}
]);