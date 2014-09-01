angular.module('mitinView',['ngRoute'])
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider){
			$routeProvider
				.when('/meetings/all',{
					templateUrl: 'views/meeting/list1.html',
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
}])
.controller('formController', ['$routeParams','$scope','$http', function($routeParams,$scope, $http){
	console.log("post dataaa");
	$scope.formData = {};
	

	// process the form
	$scope.processForm = function() {
		console.log("post form");
		$http.post('/meetings/init1', $scope.formData)
		.success(function(data) {
			console.log(data);
		});
		// $http({
  //       method  : 'POST',
  //       url     : '/meetings/init1',
  //       data    : $scope.formData  // pass in data as strings
  //       // headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
  //   })
  //       .success(function(data) {
  //           console.log(data);

  //           // if (!data.success) {
  //           // 	// if not successful, bind errors to error variables
  //           //     $scope.errorName = data.errors.name;
  //           //     $scope.errorSuperhero = data.errors.superheroAlias;
  //           // } else {
  //           // 	// if successful, bind success message to message
  //           //     $scope.message = data.message;
  //           // }
  //       });
	};
}]);
	