	var formidable = require('formidable'),
		os = require('os'),
		http = require('http'),
		util = require('util'),
		fs = require('fs.extra'),
		users = require('./users.json'),
		path = require('path');
	
	var ResponseHandler = require('./js/responseHandler.js');
	var Authentication = require('./js/authentication.js');
	var Router = require('./js/router.js');
	
	var authentication = new Authentication(users);
	var responseHandler = new ResponseHandler();
	var FileHandler = require('./js/fileHandler.js');
	var fileHandler = new FileHandler(formidable, fs, path, os, responseHandler);
	var router = new Router(responseHandler, Buffer, fileHandler, authentication, fs);
	var httpHandler = require('./js/httpHandler')(router, responseHandler);
	
	const PORT = 8888;
	const MINUTES = 5;
	var interval = MINUTES * 60 * 1000;
	var serverAdd = 'http://localhost:' + PORT;

	var deleteTempFiles = function (){
		console.log('checking for uploads...');
		var files = fs.readdirSync(os.tmpdir());
		var filesToDelete = [];
		
		for (var i = 0; i < files.length; i++){
			var uploadString = files[i].substring(0, 7);
			
			if (uploadString === 'upload_'){
				filesToDelete.push(files[i]);
			}
		}
		
		if (filesToDelete.length === 0){
			console.log('No Uploads Found...........');
			return;
		}
		
		for (var d = 0; d < filesToDelete.length; d++){
			var deleteMe = path.join(os.tmpdir(), filesToDelete[d]);
			console.log('deleting file===> ' + deleteMe);
			fs.unlinkSync(deleteMe);
		}
	};

	//Call once to clean temp files instead of waiting for timer, if any
	deleteTempFiles();
	
	http.createServer(function(req, res) {
		//set timer to delete temporary uploaded files, if any
		setInterval(deleteTempFiles, interval);
		
		switch (req.method){
			case 'GET':
				httpHandler.handleGetRequest(res, req, contentType);
				break;
			case 'POST':
				httpHandler.handlePostRequest(res, req);
				break;
			case 'PUT':
				httpHandler.handlePutRequest(res, req, contentType);
				break;
			case 'DELETE':
				httpHandler.handleDeleteRequest(res, req, contentType);
				break;
			default:
		}
	}).listen(PORT);

	console.log('Server running at --> ' + serverAdd + '/\nCTRL+C to shutdown');
