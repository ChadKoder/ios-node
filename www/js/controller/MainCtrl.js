PhotoDash.angular.controller('MainCtrl', ['$scope', '$compile', '$rootScope', function($scope, $compile, $rootScope) {
	var vm = this;
	vm.pageTitle = 'Home';
    $$(document).on('pageBeforeAnimation', function(e) {
        console.log('pageBeforeAnimation CALLED......**********');
                 // Never recompile index page
                // if (e.detail.page.name != 'index') {
                 // Ajax pages must be compiled first
                // $compile(e.target)($scope);
                // $scope.$apply();
                 //}
                 
                 // Send broadcast event when switching to new page
               //  $rootScope.$broadcast(e.detail.page.name + 'PageEnter', e);
                 });

    $$(document).on('pageAfterAnimation', function(e) {
        console.log('pageAfterAnimation called<--**********');
                 // Send broadcast if a page is left
                 var fromPage = e.detail.page.fromPage;
                 if (fromPage) {
                 $rootScope.$broadcast(fromPage.name + 'PageLeave', e);
                 if (fromPage.name != 'index') {
                 var prevPage = angular.element(document.querySelector('#'+fromPage.name));
                 prevPage.remove();
                 }
                 }
                 });
                                         
                                         /*$$(document).on('pageBeforeAnimation', function(e) {
		var pageName = e.detail.page.name;
		if (pageName === 'index'){
			vm.pageTitle = 'Home';
		}
		if (pageName === 'photos'){
			vm.pageTitle = 'Photos';
		}

		if (pageName === 'photo-album'){
			vm.pageTitle = 'Photo Album';
		}
		if (pageName === 'contacts'){
			vm.pageTitle = 'Contacts';
		}

		if (pageName === 'videos'){
			vm.pageTitle = 'Videos';
		}
		
		$scope.$apply();
	});*/
}]);
