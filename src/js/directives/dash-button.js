angular.module('dash-client').directive('dashButton', 
	function () {
		return {
			transclude: true,
			templateUrl:  './views/dash-button.html',
			replace: true,
			scope: {
				buttonAction: '&',
				actionDescription: '=',
				warningDescription: '=',
				dashSvgSrc: '='
			},
			link: function(scope, element, attrs){
			}
		}
});