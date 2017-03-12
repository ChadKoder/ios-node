PhotoDash.angular.controller('MainCtrl', ['$scope', '$compile', '$rootScope', function($scope, $compile, $rootScope) {
	var vm = this;
	
    $$(document).on('pageBeforeAnimation', function(e) {
       // console.log('pageBeforeAnimation CALLED......**********');
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
        //console.log('pageAfterAnimation called<--**********');
                 // Send broadcast if a page is left
                 var fromPage = e.detail.page.fromPage;
				 var url = e.detail.page.url;
				 
				 console.log('fromPage: ' + fromPage);
				 console.log('url: ' + url);
				 
				 console.log('remove FROMPAGE or URL?:?? ^^^');
				 console.log('Attempt REMOVE previous page, page ---> ' + fromPage.name);
                 if (fromPage) {
                 $rootScope.$broadcast(fromPage.name + 'PageLeave', e);
                 if (fromPage.name != 'index') {
                 var prevPage = angular.element(document.querySelector('#'+fromPage.name));
                 prevPage.remove();
                 }
                 }
                 });
				 
				 
				 
				 $$(document).on('page:back', function(e){
				 console.log('e.details.page.name ===> ' + JSON.stringify(e));
					console.log('*****PAGE: BACK!!!!!********');
				 });
                                         
        
}]);
