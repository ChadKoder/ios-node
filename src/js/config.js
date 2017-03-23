var $$ = Dom7;
var PhotoDash = {};
var mainView = {};

PhotoDash.config = {};

$$(document).on('DOMContentLoaded', function() {
	PhotoDash.fw7 = {
		app: new Framework7({
			pushState: false,
			cache: false,
			uniqueHistory: true,
			//imagesLazyLoadSequential: true,
			//imagesLazyLoadPlaceholder: 'Test?',
			animateNavBackIcon: true,
			popupCloseByOutside: false,
			angular: true,
			sortable: false,
			modalTitle: 'Modal!!!',
			scrollTopOnStatusbarClick: true
		}),
		options: {
			//dynamicNavbar: true
		},
		views: []
	};

	//mainView = PhotoDash.fw7.app.addView('.view-main', {});
});


var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window){
    return $window._;
}]);

PhotoDash.angular = angular.module('PhotoDash', ['underscore'])

.config(['$compileProvider', function ($compileProvider) {
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|cdvphotolibrary):/);
}])
.run(function() {
	document.addEventListener("deviceready", function(){
		console.log('cordova device ready');
		mainView = PhotoDash.fw7.app.addView('.view-main', PhotoDash.fw7.options);
		PhotoDash.fw7.views.push(mainView);
	}, false);
});
