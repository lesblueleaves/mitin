var module = angular.module('meetingApp.MeetingService', []);

module.factory('MeetingService', ['$http', function($http){
	var save = function(meeting, cb){
		$http.post('/meetings/add',meeting)
			.success(function(data) {
				console.log("save meeting ok");
				cb(data);
			});
	};
	var findOne = function(meetingId,cb){
		$http.get('/meetings/'+meetingId)
			.success(function(data) {
				cb(data);
			});
	};
    return {
    	save: save,
    	findOne: findOne
    };
}]);
