// module.factory('srInterceptor', ['$log', function($log) {
//     $log.debug('$log is here to show you that this is a regular factory with injection');
//     var srInterceptor = {
// 		console.log("intercepting...");   
//     };
//     return srInterceptor;
// }]);
(function(){
  'use strict';
  angular.module('auth-interceptor', [])
  .factory('AuthenticationService', function(){
	  	var auth = {
			isLogged: false
		}
		return auth;
  })
  .factory('UserService', function($http) {
	return {
		logIn: function(username, password) {
			return $http.post('users/loggedin', {username: username, password: password});
		},
		logOut: function() {
		}
	}
})
  .factory('TokenInterceptor', function ($q, $window, AuthenticationService) {
  	return {
		request: function (config) {
			config.headers = config.headers || {};
			if ($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}
			return config;
		},

		response: function (response) {
		    return response || $q.when(response);
		}
  	};
});
})();
