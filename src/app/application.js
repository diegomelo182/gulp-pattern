(function(){
	angular
		.module('application', [])
		.controller('MainCtrl', MainCtrl)

	MainCtrl.$inject = ['$http'];
	function MainCtrl(http){
		vm = this;
	}
})();