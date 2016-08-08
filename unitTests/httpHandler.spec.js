describe('httpHandler', function(){
	var responseHandler = new ResponseHandler(),
	router = new Router(),
	unitTestMocks = new UnitTestMocks(),
	unitTestData = new UnitTestData(),
	fileSystem,
	httpHandler,
	workingDir = "C:/",
	req;
	 
	 beforeEach(function() {
		spyOn(responseHandler, 'write405MethodNotAllowed'); 
	 });
  
	it('handleGetRequest should call router.get when route is not node_modules or src', function () {
		 
		req = unitTestMocks.request(null, 'anything');
		httpHandler = new HttpHandler(router, responseHandler);
	
		httpHandler.handleGetRequest(unitTestMocks.response, req, 'application/json');
		expect(responseHandler.write405MethodNotAllowed).toHaveBeenCalled();
	}); 
	 
	it ('handlePostRequest should call router.post', function () {
		spyOn(router, 'post');
		req = unitTestMocks.request(null, 'any');
		httpHandler = new HttpHandler(router, responseHandler);
		httpHandler.handlePostRequest(unitTestMocks.response, req, 'application/json');
		
		expect(router.post).toHaveBeenCalled();
	}); 
 
	it ('handlePutRequest should call responseHandler.write405MethodNotAllowed', function () {
		req = unitTestMocks.request(null, 'any');
		httpHandler = new HttpHandler(router, responseHandler);
		httpHandler.handlePutRequest(unitTestMocks.response, req, 'application/json');
		
		expect(responseHandler.write405MethodNotAllowed).toHaveBeenCalled();
	});
	  
	it ('handleDeleteRequest should call responseHandler.write405MethodNotAllowed', function () {
		req = unitTestMocks.request(null, 'any');
		httpHandler = new HttpHandler(router, responseHandler);
		httpHandler.handleDeleteRequest(unitTestMocks.response, req, 'application/json');
		
		expect(responseHandler.write405MethodNotAllowed).toHaveBeenCalled();
	}); 
});