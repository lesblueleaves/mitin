var mitinApp = angular.module('meetingApp',['ngCookies', 'meetingApp.MeetingService','ui.router']);

mitinApp.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
	var checkLoggedin = function($q, $timeout, $http, $location){
		var deferred = $q.defer();
		$http.get('/users/loggedin').success(function(user){
			// Authenticated
        	if (user !== '0') $timeout(deferred.resolve);
	        // Not Authenticated
	        else {
	          $timeout(deferred.reject);
	          $location.url('/users/login');
	        }
		});
		return deferred.promise;
	};

	// $httpProvider.interceptors.push('srInterceptor');
    $stateProvider
	    .state('home', {
	            url: '/',
	            templateUrl: 'views/home.html'
	        })
        .state('meetings-all', {
            url: '/meetings/all',
            templateUrl: 'views/meeting/list.html',
            controller: 'MeetingCtrl',
             resolve: {
	          loggedin: checkLoggedin
	        }
        })
        .state('meetings-create', {
        	url: '/meeting',
            templateUrl: 'views/meeting/create.html',
            controller: 'MeetingController'
        })
		.state('meetings-view', {
        	url: '/meetings/:meetingId',
            templateUrl: 'views/meeting/view.html',
            controller: 'MeetingController'
        })
		.state('auth', {
        	url: '/auth',
            templateUrl: 'views/user/index.html',
            controller: 'UserCtrl'
        })
        .state('auth.register', {
	        url: '/users/register',
	        templateUrl: 'views/user/register.html',
	        controller: 'UserCtrl'
	        // resolve: {
	        //   loggedin: checkLoggedOut
	        // }
      	})
        .state('auth.login', {
	        url: '/users/login',
	        templateUrl: 'views/user/login.html',
	        controller: 'UserCtrl'
	        // resolve: {
	        //   loggedin: checkLoggedOut
	        // }
      	});
    $urlRouterProvider.otherwise('/home');

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/users/login');
                }
                return $q.reject(response);
            }
        };
    });
})
.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, Auth) {

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        console.log(toState);
        if(!("data.access" in toState)){
            // $rootScope.error = "Access undefined for this state";
            // event.preventDefault();
        }
        else if (!Auth.authorize(toState.data.access)) {
            $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
            event.preventDefault();

            if(fromState.url === '^') {
                if(Auth.isLoggedIn()) {
                    $state.go('home');
                } else {
                    $rootScope.error = null;
                    $state.go('auth.login');
                }
            }
        }
    });

}]);

mitinApp.controller('HeaderCtrl', function($scope, $rootScope,AuthService){
	console.log(AuthService.isLoggedIn(AuthService.user));
	// console.log( !! AuthService.user);
	  $scope.global = {
        authenticated: !! AuthService.isLoggedIn(AuthService.user),
        user: AuthService.user
      };
	    // $scope.userRoles = Auth.userRoles;
	    // $scope.accessLevels = Auth.accessLevels;
	$rootScope.$on('loggedin', function() {
      $scope.global = {
        authenticated: !! $rootScope.user,
        user: $rootScope.user
      };
    });
});


mitinApp.controller('MeetingCtrl', function($scope, $http){
	$http.get('/meetings/all').success(function(data){
		$scope.meetings = data;
	});
});

mitinApp.controller('MeetingController', function($scope,$location, $stateParams, MeetingService){
	$scope.findOne = function(){
		var meetingId =  $stateParams.meetingId;
		MeetingService.findOne(meetingId, function(data){
			$scope.meeting = data;
		});
	};
	$scope.create= function(isValid){
		console.log(isValid);
		if(isValid){
			$scope.meeting.starttime = rome.find(startTime).getDate();
			$scope.meeting.endtime = rome.find(endTime).getDate();
			MeetingService.save($scope.meeting, function(response){
				$location.path('meetings/' + response._id);
			});
			$scope.meeting = {};
		}
	}
});

mitinApp.controller('UserCtrl', function($scope, $rootScope, $location, $stateParams,$http,$cookieStore){
	$scope.user = {};

	$scope.login = function(){
		$http.post('/users/login', {
          email: $scope.user.email,
          password: $scope.user.password
        })
          .success(function(response) {
            // authentication OK
            $scope.loginError = 0;
            $rootScope.user = response.user;
            $cookieStore.put('user',$rootScope.user);
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/home');
            }
          })
          .error(function() {
            $scope.loginerror = 'Authentication failed.';
          });
	}

	$scope.register = function() {
		$scope.usernameError = null;
		$scope.registerError = null;
		$http.post('/users/register', {
		  email: $scope.user.email,
		  password: $scope.user.password,
		  confirmPassword: $scope.user.confirmPassword,
		  username: $scope.user.username,
		  name: $scope.user.name
		})
		  .success(function() {
		    // authentication OK
		    $scope.registerError = 0;
		    $rootScope.user = $scope.user;
		    $rootScope.authenticated = true;

		    // console.log($rootScope.user);
		    
		    $rootScope.$emit('loggedin');
		    // $location.url('/');
		    $location.path('/home');
		  })
		  .error(function(error) {
		    // Error: authentication failed
		    if (error === 'Username already taken') {
		      $scope.usernameError = error;
		    } else if (error === 'Email already taken') {
		      $scope.emailError = error;
		    } else $scope.registerError = error;
		  });
	};
});
