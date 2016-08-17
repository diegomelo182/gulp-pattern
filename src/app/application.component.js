(function() {
	'use strict';
	
	angular
		.module('application')
		.component('application', {
			templateUrl: '/app/application.template.html',
			controller: MainCtrl
		});

	MainCtrl.$inject = ['$http'];

	function MainCtrl($http) {
	    var vm = this;
	    vm.foo = 'Application works!';
	  }
})();
