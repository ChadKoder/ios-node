angular.module('dash-client').directive('settings', function () {
	return {
		restrict: 'E',
		templateUrl: './views/settings.html',
		 controller: 'SettingsCtrl',
		 controllerAs: 'vm'
	}
});