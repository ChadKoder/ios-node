PhotoDash.angular.factory('authService', function () {
       var service = this;
		
		var getAuthHeader = function(username, password){
			var encoded = btoa(username + ':' + password);
			var rs = 'Basic ' + encoded;
			return rs;
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
			
			var credStr = atob(ut);
			console.log('DIR GOT Creds ---> ' + credStr);
			return credStr.split(':');
		};

		var saveCreds = function(username, password){
			var utString = username + ':' + password;
			console.log('utString : ' + utString);
			
			window.localStorage.setItem('ut', JSON.stringify(btoa(utString)));
			console.log('*** CREDS SAVED!!');
		};
	   
      return {
        getAuthHeader: getAuthHeader,
		getUserCreds: getCreds,
		saveUserCreds: saveCreds
        }
 });
