function HttpHandler (router, responseService) {
	return {
		handleGetRequest: function (res, req, contentType){
			responseService.write405MethodNotAllowed(res);
			return;
		},
		handlePostRequest: function (res, req){
			router.post(res, req);
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