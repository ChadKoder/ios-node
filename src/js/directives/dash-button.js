angular.module('dash-client').directive('dashButton', [
       function () {
       return {
       transclude: true,
       templateUrl: './views/dash-button.html',
       
       replace: true,
       scope: {
           buttonAction: '&'
       },
       link: function(scope, element, attrs){
              // scope.buttonAction = scope.buttonAction();
            //   scope.description = scope.description;
              // scope.svgIcon = scope.svgIcon;
           }
        }
}]);