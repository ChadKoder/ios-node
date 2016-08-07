function HttpHandler (path, currentWorkingDir, router, responseService) {
	return {
		handleGetRequest: function (res, req, contentType){
			responseService.write405MethodNotAllowed(res);
			return;
		},
		handlePostRequest: function (res, req, contentType){
			router.post(res, req, contentType);
			return;
		},
		
		handlePutRequest: function(res, req, contentType){
			responseService.write405MethodNotAllowed(res);
			return;
		},
		handleDeleteRequest: function(res, req, contentType){
			responseService.write405MethodNotAllowed(res);
			return;
		}
	};
} 

module.exports = HttpHandler;