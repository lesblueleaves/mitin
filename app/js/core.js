angular.module('mitinView',['ngRoute'])
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider){
			$routeProvider
				.when('/meetings/all',{
					templateUrl: 'views/meeting/list.html',
		            controller: 'MeetingCtrl',
		            controllerAs: 'meeting'
				});
		// configure html5 to get links working on jsfiddle
        // $locationProvider.html5Mode(true);
}])
.controller('MeetingCtrl', ['$routeParams','$scope','$http', function($routeParams,$scope, $http){
	this.name = "MeetingCtrl";
	this.params = $routeParams;
	$http.get('meetings/all').success(function(data){
		$scope.meetings = data;
	});
}]);
	