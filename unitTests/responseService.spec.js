describe ('ResponseHandler', function (){
	var responseHandler = new ResponseHandler();
	var unitTestMocks = new UnitTestMocks();
	var res = unitTestMocks.response;
	
	it('write200OKWithData should call res.writeHeader with 200 OK and object', function() {
		var obj = { data: 'obj' };
		responseHandler.write200OKWithData(res, obj);
		expect(res.writeHeader).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json'});
		expect(res.write).toHaveBeenCalledWith(JSON.stringify(obj));
		expect(res.end).toHaveBeenCalled();
	});
	
	it('write204NoContent should call res.write with 204 No Content', function(){
		responseHandler.write204NoContent(res);
		expect(res.writeHeader).toHaveBeenCalledWith(204);
		expect(res.write).toHaveBeenCalledWith('204 No Content');
		expect(res.end).toHaveBeenCalled();
	});
	
	it('write401Unauthorized should call res.write with 401 Unauthorized', function() {
		responseHandler.write401Unauthorized(res);
		expect(res.writeHeader).toHaveBeenCalledWith(401);
		expect(res.write).toHaveBeenCalledWith('401 Unauthorized');
		expect(res.end).toHaveBeenCalled();
	});
	
	it('write404NotFound should call res.writeHeader with 404 Not Found', function() {
		responseHandler.write404NotFound(res);
		expect(res.writeHeader).toHaveBeenCalledWith(404);
		expect(res.write).toHaveBeenCalledWith('404 Not Found');
		expect(res.end).toHaveBeenCalled();
	});
	
	it('write405MethodNotAllowed should call res.writeHeader with 405 Method Not Allowed', function() {
		responseHandler.write405MethodNotAllowed(res);
		expect(res.writeHeader).toHaveBeenCalledWith(405, {'Allow': 'GET' });
		expect(res.write).toHaveBeenCalledWith('405 Method Not Allowed');
		expect(res.end).toHaveBeenCalled();
	});
	
	it('write500InternalError should call res.writeHeader with 405 Method Not Allowed', function() {
		responseHandler.write500InternalError(res, 'error123');
		expect(res.writeHeader).toHaveBeenCalledWith(500);
		expect(res.write).toHaveBeenCalledWith('500 Internal Server Error: error123\n');
		expect(res.end).toHaveBeenCalled();
	});
	
	it('write400BadRequest should call res.writeHeader with 400 Bad Request', function() {
		responseHandler.write400BadRequest(res);
		expect(res.writeHeader).toHaveBeenCalledWith(400);
		expect(res.write).toHaveBeenCalledWith('400 Bad Request');
		expect(res.end).toHaveBeenCalled();
	});
	
	describe('write200Success', function () {
		var	file = 'file', 
			fileName = 'fileName',
			contentType = 'application/json';
				
		it('should write file if a file is provided', function () {
			responseHandler.write200Success(res, file, fileName, contentType);
			expect(res.writeHeader).toHaveBeenCalled();
			expect(res.write).toHaveBeenCalledWith(file, 'binary');
			expect(res.end).toHaveBeenCalled();
		});
		
		it('should only write 200 OK when file is not provided', function () {
			file = null;
			responseHandler.write200Success(res, file, fileName, contentType);
			expect(res.writeHeader).toHaveBeenCalled();
			expect(res.write).toHaveBeenCalledWith('200 OK');
			expect(res.end).toHaveBeenCalled();
		});
	});
	
});

