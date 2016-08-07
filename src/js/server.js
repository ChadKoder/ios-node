var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs   = require('fs.extra');

/*
***TODO***
DELETE TEMP FILES IN /temp/ folder!
*/
 
http.createServer(function(req, res) {

  /* Process the form uploads */
  if (req.url == '/' && req.method.toLowerCase() == 'post') {
	console.log('POST RECEIVED...');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
		//console.log('fields : ' + JSON.stringify(fields));
		console.log('total files: ' + files.length);
		res.writeHead(200, {'content-type': 'text/plain'});
		res.write('received upload:\n\n');
		res.end(util.inspect({fields: fields, files: files}));
    });
 
    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
       // console.log(percent_complete.toFixed(2));
    });
 
    form.on('error', function(err) {
		console.log('ERROR: ' + JSON.stringify(err));
    });
 
    form.on('end', function(fields, files) {
		var ctr = 1;
		for (var i = 0; i < this.openedFiles.length; i++){
			var temp_path = this.openedFiles[i].path;
			var date = new Date();
			var month = date.getMonth();
			var day = date.getDate();
			var fileName = month + '_' + day + '_' + (date.getUTCMilliseconds() + 10000) + '_' + ctr + '_' + '.jpeg';
			console.log('fileName: ' + fileName);
			var newLocation = './photos/';
	 
			fs.copy(temp_path, newLocation + fileName, function(err) {  
				if (err) {
					console.error(err);
				} else {
					console.log("success!")
				}
			});

			ctr++;
		}


        
    });
 
    return;
  }
 
  /* Display the file upload form. */
  res.writeHead(200, {'content-type': 'text/html'});
  res.end();
 
}).listen(8888);
