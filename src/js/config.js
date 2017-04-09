var $$ = Dom7;
var PhotoDash = {};
var mainView = {};

PhotoDash.config = {};

$$(document).on('DOMContentLoaded', function() {
	
	var modalActionsTemplate = '<div class="actions-modal">	{{#each this}}	<div class="actions-modal-group">		{{#each this}}		{{#if label}}		<span class="actions-modal-label">{{text}}</span>		{{else}}		<div class="actions-modal-button {{#if color}}color-{{color}}{{/if}} {{#if bold}}actions-modal-button-bold{{/if}}">			<div>				{{#if isCancel}}				<div>{{text}}</div>				{{else}}				<div style="float: left; padding-left: 25px;">{{text}}</div>				{{/if}}								{{#if isCapturePhoto}}					<div style="float: right; padding-right: 15px; color: #076DF9;"><i class="f7-icons">camera_fill</i></div>				{{/if}}								{{#if isLibrary}}					<div style="float: right; padding-right: 15px; color: #076DF9;"><i class="f7-icons">photos</i></div>				{{/if}}						</div>		</div>		{{/if}}		{{/each}}	</div>	{{/each}}</div>';
	
	PhotoDash.fw7 = {
		app: new Framework7({
			pushState: false,
			cache: true,
			//uniqueHistory: true,
			//imagesLazyLoadSequential: true,
			//imagesLazyLoadPlaceholder: 'Test?',
			animateNavBackIcon: true,
			popupCloseByOutside: false,
			angular: true,
			sortable: false,
			modalTitle: 'Photo Dash',
			scrollTopOnStatusbarClick: true,
			modalActionsTemplate: modalActionsTemplate
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
