Framework7.prototype.plugins.angular = function(app, params) {
	function compile(newPage) {
		try {
            console.log('VV NEW PAGE VV');
            //console.log(newPage);
            
			var $page = $(newPage);
            console.log('$page -->');
          //  var test = JSON.stringify($page);
          //  console.log(test.includes('img'));
			angular.element(document).ready(function(){
				var injector = angular.element('[ng-app]').injector();
				
				//if (injector){
					var $compile = injector.get('$compile');
					var $timeout = injector.get('$timeout');
					var $rootScope = injector.get('$rootScope');
				   
					$scope = $rootScope.$$childHead;
					$timeout(function() {
						$compile($page)($scope);
					});
				//} else {
					//console.log('framework7.angular.hook.js did nothing. No injector');
					
				//}
			});
		} catch (e) {
			console.error("Some Error Occured While Compiling The Template", e);
		}
	}

	return {
		hooks: {
			pageInit: function(pageData) {
				compile(pageData.container);
			}
		}
	}
};
