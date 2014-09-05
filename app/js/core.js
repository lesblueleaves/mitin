var mitinApp = angular.module('meetingApp',['meetingApp.MeetingService','ngRoute']);
mitinApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider
			.when('/meetings/all',{
				templateUrl: 'views/meeting/list.html',
	            controller: 'MeetingCtrl',
	            controllerAs: 'meeting'
			})
			.when('/createMeeting',{
				templateUrl: 'views/meeting/create.html',
	            controller: 'MeetingController'
			})
			.when('/meetings/:meetingId',{
				templateUrl: 'views/meeting/view.html',
	            controller: 'MeetingController'
			});
}]);

mitinApp.controller('MeetingCtrl', ['$routeParams','$scope','$http', function($routeParams,$scope, $http){
	this.params = $routeParams;
	$http.get('meetings/all').success(function(data){
		$scope.meetings = data;
	});
}])

mitinApp.controller('MeetingController', function($scope,$location, $routeParams, MeetingService){
	$scope.findOne = function(){
		var meetingId =  $routeParams.meetingId;
		console.log("meetingId");
		console.log(meetingId);
		MeetingService.findOne(meetingId, function(data){
			$scope.meeting = data;
		});
	};
	$scope.create= function(isValid){
		console.log(isValid);
		$scope.meeting.starttime = rome.find(startTime).getDate();
		$scope.meeting.endtime = rome.find(endTime).getDate();
		MeetingService.save($scope.meeting, function(response){
			console.log(response._id);
			$location.path('meetings/' + response._id);
		});
		$scope.meeting = {};
	}
});
