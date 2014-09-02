var module = angular.module('meetingApp.MeetingService', []);

module.factory('MeetingService', ['$http', function($http){
	var save = function(meeting, callback){
		$http.post('/meetings/add',meeting)
			.success(function(data) {
				console.log("ok");
				callback(data);
			});
	};

	var findOne = function(meetingId,cb){
		$http.get('/meetings/'+meetingId)
			.success(function(data) {
					console.log("findOne ok");
					console.log(data);
					cb(data);
				});
	};

	var showMessageFunction = function(msg) {
            alert(msg);
        };
        return {
        	save: save,
        	findOne: findOne,
            showMessage: showMessageFunction
        };
}]);
