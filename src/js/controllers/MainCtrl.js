angular.module('dash-client')
.controller('MainCtrl', ['$location', '$scope',
function ($location, $scope) {
	var vm = this;
	var svg = null;
	var deferred = [];
	
	vm.style = {
		width: '50px',
		height: '50px',
		fill: 'blue'
	};
	
	var test = false;
	
	vm.toggleStyle = function(){
		if (test){
			vm.style = {
				width: '50px',
				height: '50px',
				fill: 'yellow'
			}
		} else{
			vm.style = {
				width: '50px',
				height: '50px',
				fill: 'green'
			}
		}
	};	
	
	$scope.iconStyle1 = {
		'width': '50px',
		'height': '50px',
		'fill': 'white'
   }; 
		   
	$scope.iconStyle2 = {
		'width': '50px',
		'height': '50px',
		'fill': 'black'
   };
   
   $scope.iconStyle = $scope.iconStyle1;
		   
		   
	$scope.changeColor = function(){
		if ($scope.iconStyle == $scope.iconStyle1){
			alert('changing to black');
			$scope.iconStyle = $scope.iconStyle2;
		} else{
			$scope.iconStyle = $scope.iconStyle1;
			alert('changing to white');
		}
	}
}]);