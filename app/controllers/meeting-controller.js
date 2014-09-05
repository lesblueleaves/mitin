var mitinApp = angular.module('meetingApp',['meetingApp.MeetingService','ui.router','auth-interceptor']);

mitinApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('auth-interceptor');
});

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

	$httpProvider.interceptors.push('srInterceptor');

    // $urlRouterProvider.otherwise('/home');
    $stateProvider
	    .state('home', {
	            url: '/home',
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
        	url: '/user',
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
	        url: '/register',
	        templateUrl: 'views/user/register.html',
	        controller: 'UserCtrl'
	        // resolve: {
	        //   loggedin: checkLoggedOut
	        // }
      	})
        .state('auth.login', {
	        url: '/login',
	        templateUrl: 'views/user/login.html',
	        controller: 'UserCtrl'
	        // resolve: {
	        //   loggedin: checkLoggedOut
	        // }
      	})
        ;
});

mitinApp.controller('HeaderCtrl', function($scope, $rootScope){
	console.log('get in HeaderCtrl');
	$rootScope.$on('loggedin', function() {
	console.log('login');
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
		$scope.meeting.starttime = rome.find(startTime).getDate();
		$scope.meeting.endtime = rome.find(endTime).getDate();
		MeetingService.save($scope.meeting, function(response){
			$location.path('meetings/' + response._id);
		});
		$scope.meeting = {};
	}
});

mitinApp.controller('UserCtrl', function($scope, $rootScope, $location, $stateParams,$http){
	$scope.user = {};

	$scope.login = function(){
		$http.post('/users/login', {
          email: $scope.user.email,
          password: $scope.user.password
        })
          .success(function(response) {
          	console.log(response);
            // authentication OK
            $scope.loginError = 0;
            // $rootScope.authenticated = true;
            // $rootScope.user = response.user;
            // console.log($rootScope.user);
            $rootScope.$emit('loggedin');
            // console.log($rootScope.user);
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

		    console.log($rootScope.user);
		    
		    $rootScope.$emit('/users/loggedin');
		    // console.log($rootScope.user);
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
