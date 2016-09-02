//js/directives/fileInput.js
/*
angular.module('photoSaverApp', []).directive('testDirective', ['$timeout',
	function ($timeout) {
		return {
			restrict: 'E',
			template: [
            <div class="myDirective">What the fuuuck</div>
            'WTFFFFFFFFFFFFFFF',
			'<md-button class="file-input" ng-click="vm.openDialog($event, this)">',
					'Select Photos [test]',
					'<input multiple accept="image/*" type="file" class="file-input"></input>',
				'</md-button>'
				].join(''),
				replace: true,
				require: 'ngModel',
				scope: {
					allFiles: '=?'
				},
				link: function(scope, element, attrs, ctrl){
					alert('heeeere...');
					var elFileinput = angular.element(element[0]
						.querySelector('.file-input'));
						
						
           
				}
		}
	}]);*/

    angular.module('dash-client').directive('fileInput', function () {
       return {
           restrict: 'E',
           template: '<md-button class="md-primary md-raised file-input-container" ng-click="vm.openDialog($event, this)"> Select {{vm.selectedMedia}}<input multiple accept="image/*" type="file" class="file-input"></input></md-button>',
		   replace: true,
		   require:'ngModel',
		   link: function (element, attrs, ctrl) {
			   //var fileInput = angular.element(element[0].
			   alert('jhretrrrtr');
		   }
       
       }
    });