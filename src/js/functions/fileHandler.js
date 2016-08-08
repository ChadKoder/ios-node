function FileHandler(formidable, fileSystem, path, os, responseHandler) {
	return {
		handle: function (res, req){
			var form = new formidable.IncomingForm();
			form.parse(req, function(err, fields, files) { 
				res.writeHead(200, {'content-type': 'text/plain'});
				res.write('received upload:\n\n');
				res.end();
			});
		 
			/*	form.on('progress', function(bytesReceived, bytesExpected) {
				var percent_complete = (bytesReceived / bytesExpected) * 100;
			   // console.log(percent_complete.toFixed(2));
			});*/
		 
			form.on('error', function(err) {
				console.log('ERROR: ' + JSON.stringify(err));
			});
		 
			form.on('end', function(fields, files) {
				var ctr = 1;
				for (var i = 0; i < this.openedFiles.length; i++){
					var tempPath = this.openedFiles[i].path;
					
					var date = new Date();
					var month = date.getMonth();
					var day = date.getDate();
					var fileExt = path.extname(this.openedFiles[i].name);
					var fileName = month + '_' + day + '_' + (date.getUTCMilliseconds() + 100000) + '_' + ctr + fileExt;
					console.log('fileName: ' + fileName);
					var newLocation = './photos/';
			 
					fileSystem.copy(tempPath, newLocation + fileName, function(err) {  
						if (err) {
							console.log('Error: ' + err);
							responseHandler.write500InternalError(res, err);
							
						} else {
							console.log("success!")
						}
					});

					ctr++;
				}
			});
		}
	}
}

module.exports = FileHandler;