var mitinApp = angular.module('meetingApp');
mitinApp.controller('MeetingController', function($scope,$location, $stateParams, MeetingService){
	$scope.find = function(){
		MeetingService.findAll(function(data){
			$scope.meetings = data;
		});
	};
	$scope.findOne = function(){
		var meetingId =  $stateParams.meetingId;
		MeetingService.findOne(meetingId, function(data){
			$scope.meeting = data;
		});
	};
	$scope.create= function(isValid){
		if(isValid){
			$scope.meeting.starttime = rome.find(startTime).getDate();
			$scope.meeting.endtime = rome.find(endTime).getDate();
			MeetingService.save($scope.meeting, function(response){
				$location.path('/meetings/' + response._id);
			});
			$scope.meeting = {};
		}
	};
});
