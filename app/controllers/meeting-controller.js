var mitinApp = angular.module('meetingApp',['ngCookies', 'meetingApp.MeetingService','ui.router']);

mitinApp.config(function($stateProvider, $urlRouterProvider,$httpProvider,$locationProvider) {
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
    	.state('404', {
	            url: '/404/',
	            templateUrl: 'views/404.html',
	            access: 'public'
	        })
    	.state('index', {
	            abstract: true,
	            template: "<ui-view/>",
	            access: 'public'
	        })
	    .state('home', {
	            url: '/',
	            templateUrl: 'views/home.html',
	            access: 'private'
	        })
        .state('meetings-all', {
            url: '/meetings',
            templateUrl: 'views/meeting/list.html',
            controller: 'MeetingCtrl',
            resolve: {
	          loggedin: checkLoggedin
	        },
	        access: 'private'
        })
        .state('meetings-create', {
        	url: '/meeting/',
            templateUrl: 'views/meeting/create.html',
            controller: 'MeetingController',
            resolve: {
	          loggedin: checkLoggedin
	        },
	        access: 'private'
        })
		.state('meetings-view', {
        	url: '/meetings/:meetingId/',
            templateUrl: 'views/meeting/view.html',
            controller: 'MeetingController',
            access: 'private'
        })
		.state('user', {
			abstract: true,
            // template: "<ui-view/>",
        	// url: '/user',
            templateUrl: 'views/user/index.html',
            controller: 'UserCtrl',
            access: 'private'
        })
        .state('register', {
	        url: '/users/register/',
	        templateUrl: 'views/user/register.html',
	        controller: 'UserCtrl',
	        access: 'public'
	        // resolve: {
	        //   loggedin: checkLoggedOut
	        // }
      	})
        .state('login', {
	        url: '/users/login/',
	        templateUrl: 'views/user/login.html',
	        controller: 'UserCtrl',
	        access: 'public'
	        // resolve: {
	        //   loggedin: checkLoggedOut
	        // }
      	});
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
            	console.log(response.status)
                if(response.status === 401 || response.status === 403) {
                	console.log('40*');
                	// $state.go('users.login');
                    $location.path('/users/login');
                }
                // else if(response.status === 404){

                // }
                return $q.reject(response);
            }
        };
    });
})
.run(['$rootScope', '$state', '$location','AuthService', function ($rootScope, $state, $location, AuthService) {

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        console.log(toState);
        console.log(fromState);
        console.log(AuthService.isLoggedIn());
        // if(!("data.access" in toState)){
            // $rootScope.error = "Access undefined for this state";
            // event.preventDefault();
        // }
         // if (!Auth.authorize(toState.data.access)) {
         //    $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
         //    event.preventDefault();

            if(fromState.url === '^' && toState.access === 'private') {
            	console.log('state run');
                if(AuthService.isLoggedIn()) {
                    $state.go('home');
                } else {
                    $rootScope.error = null;
                    $state.go('login');
                    // $location.path('/users/login');
                }
            }
        // }
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
          	console.log('got err!');
            $scope.loginerror = 'Authentication failed.';
          });
	},

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
