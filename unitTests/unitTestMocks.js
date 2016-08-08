function UnitTestMocks() {
	var readFileError = false;
	return {
		response: {
			writeHeader: jasmine.createSpy('res.writeHeader'),
			write: jasmine.createSpy('res.write'),
			end: jasmine.createSpy('res.end'),
			setHeader: jasmine.createSpy('res.setHeader')
		},
		fileSystem: {
			//readFile: jasmine.createSpy('fs.readFile'),
			readFile: function (fileName, type, callback){
				if (readFileError){
					callback('ERROR', 'file');
				} else {
					callback();
				}
			},
			setFileReadError: function (val) {
				readFileError = val;
			},
			writeFileSync: jasmine.createSpy('fs.writeFileSync')
		},
		request: function (headers, url, mockData){
			var req = { headers: {}, 
				url: url, 
				on: function (a, reqFunction) {
					if (a === 'data'){
						if (mockData === undefined) {
							reqFunction(null);
						} else {
							reqFunction(JSON.stringify(mockData));
						}
					} 
					if (a === 'end'){
						reqFunction();
					}
				} 
			};
			
			if (headers) {
				for (var i = 0; i < headers.length; i++){
					req.headers[headers[i].header] = headers[i].value; 
				}
			}
				
			return req;
		},
		path: {
			join: function (a, b) {
				if (a && b){
					return a.toString() + b.toString();
				}
			}
		},
		url: {
			parse: function (a, b) {
				return { pathname: a, query: { id: 'identifier' }};
			}
		}
	}
}

module.exports = UnitTestMocks;