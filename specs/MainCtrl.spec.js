describe('MainCtrl', function () {
	var ctrl,
		$http,
		$mdToast = jasmine.createSpyObj('$mdToast', ['showSimple']);

	beforeEach(function(){
		angular.mock.module('photoSaverApp');
	});
	
	beforeEach(inject(function($controller, _$httpBackend_) {
		$http = _$httpBackend_;
		ctrl = $controller('MainCtrl', {
			$mdToast: $mdToast
		});
	}));
	
	
	/*afterEach(function() {
		$http.verifyNoOutstandingExpectation();
		$http.verifyNoOutstandingRequest();
	});*/
   
	it('ctrl.showSimpleToast should display toast msg', function() {
			ctrl.showSimpleToast('test');
			expect($mdToast.showSimple).toHaveBeenCalledWith('test');
	}); 
	
	it('ctrl.showSuccessToast should call ctrl.showSimpleToast', function(){
		spyOn(ctrl, 'showSimpleToast');
		ctrl.showSuccessToast('success msg');
		expect(ctrl.showSimpleToast).toHaveBeenCalledWith('success msg');
	});
	
	it('ctrl.showErrorToast should call ctrl.showSimpleToast', function(){
		spyOn(ctrl, 'showSimpleToast');
		ctrl.showErrorToast('err msg');
		expect(ctrl.showSimpleToast).toHaveBeenCalledWith('err msg');
	});
	
	describe('ctrl.submit', function(){
		describe('when either username or password is not provided', function(){
			beforeEach(function(){
				spyOn(ctrl, 'showErrorToast');
				ctrl.username = 'uname';
				ctrl.password = 'pass';
				ctrl.ipAddress = '123.456.7.890';
				//ctrl.submit();
			});
				
			it ('should display error toast and return if username is not provided', function() {
				ctrl.username ='';
				ctrl.submit();
				$http.verifyNoOutstandingExpectation();
				$http.verifyNoOutstandingRequest();
				expect(ctrl.showErrorToast).toHaveBeenCalledWith('username and password are required.');
			});
			
			it ('should display error toast and return if password is not provided', function() {
				ctrl.password ='';
				ctrl.submit();
				$http.verifyNoOutstandingExpectation();
				$http.verifyNoOutstandingRequest();
				expect(ctrl.showErrorToast).toHaveBeenCalledWith('username and password are required.');
			});
			
			it('should set ctrl.inProgress to true', function() {
				ctrl.submit();
				expect(ctrl.inProgress).toBeTruthy();
			});
			
			//it('should POST the data', function() {
				//$http.expectPOST('http://192.168.1.109:8888/files').respond(401);
			//	 $http.flush();

		 // now you don’t care about the authentication, but
		 // the controller will still send the request and
		 // $httpBackend will respond without you having to
		 // specify the expectation and response for this request

				//$http.expectPOST('123.456.7.890:8888/files').respond(201, '');
			
	 
			//});
		});
		
		
	});
});