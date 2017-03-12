var $$ = Dom7;
var $$ = Dom7;
var PhotoDash = {};
var mainView = {};

PhotoDash.config = {};

$$(document).on('DOMContentLoaded', function() {
	PhotoDash.fw7 = {
		app: new Framework7({
			pushState: true,
			animateNavBackIcon: true,
			popupCloseByOutside: false,
			angular: true
		}),
		views: [],
		deviceContacts: { }
	};

	mainView = PhotoDash.fw7.app.addView('.view-main', {});
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
	}, false);
});
