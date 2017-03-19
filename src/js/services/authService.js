PhotoDash.angular.factory('authService', function () {
       var service = this;
			
		var createAuthHeader = function(encodedAuth){
			return 'Basic ' + encodedAuth;
		};
		
		var getAuthHeader = function(username, password){
			return createAuthHeader(btoa(username + ':' + password));
		};
		
		var showPreloader = function(msg){
			PhotoDash.fw7.app.showPreloader(msg);
		};

		var hidePreloader = function(){
			PhotoDash.fw7.app.hidePreloader();
		};
	   
	   var getCreds = function(){
			var ut = JSON.parse(window.localStorage.getItem('ut'));
			if (!ut){
				return null;
			}
			
			console.log('DIR GOT Creds ---> ' + ut);
			var credStr = atob(ut);
			return credStr.split(':');
		};

		var saveCreds = function(username, password){
			window.localStorage.setItem('ut', JSON.stringify(btoa(username + ':' + password)));
			console.log('*** CREDS SAVED!!');
		};
	   
      return {
        getAuthHeader: getAuthHeader,
		getUserCreds: getCreds,
		saveUserCreds: saveCreds
        }
 });
