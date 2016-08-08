function Router(responseHandler, Buffer, fileHandler, authentication, fileSystem) {
	return {
		post: function (res, req) {
			console.log('POST RECEIVED...');
			if (req.url == '/') {
				var authHeader = req.headers['authorization']; 
				if (authHeader){
					var auth = authHeader.split(' ')[1];
					var credString = Buffer(auth, 'base64').toString();
					var creds = credString.split(':');
				
					if (creds) {
						var userName = creds[0];
						var pass = creds[1];
						
						if (!authentication.validateUser(userName, pass)) {
							responseHandler.write401Unauthorized(res);
							return;
						} else {
							fileHandler.handle(res, req);
						}
					}
				} else {
					responseHandler.write401Unauthorized(res);
					return;
				}
		  }
		  
		  return;
		}
	}
};
	
module.exports = Router;