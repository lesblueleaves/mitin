var mitinApp = angular.module('meetingApp',['ngCookies', 'meetingApp.MeetingService','ui.router','underscore']);

mitinApp.config(function($stateProvider, $urlRouterProvider,$httpProvider,$locationProvider) {
	var access = routingConfig.accessLevels;
	function checkLoggedOut(){
		console.log('checkLoggedOut');
	}
    $stateProvider
    	.state('404', {
	            url: '/404',
	            templateUrl: 'views/404.html',
	            access: access.public
	        })
    	.state('user', {
	            url:'/users',
	            templateUrl: "views/user/index.html",
	            access: access.public
	        })
    	.state('user.home', {
	            url:'/home',
	            templateUrl: "views/home.html",
	            access: access.public
	        })
	   	.state('user.register', {
	        url: '/register',
	        templateUrl: 'views/user/register.html',
	        controller: 'UserCtrl',
	        access: access.public
      	})
        .state('user.login', {
	        url: '/login',
	        templateUrl: 'views/user/login.html',
	        controller: 'UserCtrl',
	        access: access.public
	        // resolve: {
	        //   loggedin: checkLoggedOut
	        // }
      	})
      	.state('user.logout', {
	        url: '/logout',
	        controller: 'logoutCtrl',
	        resolve: {
	          loggedin: checkLoggedOut
	        }
      	})
        .state('meetings-all', {
            url: '/meetings-all',
            templateUrl: 'views/meeting/list.html',
            controller: 'MeetingController',
        })
        .state('meetings-create', {
        	url: '/meetings-create',
            templateUrl: 'views/meeting/create.html',
            controller: 'MeetingController',
        })
		.state('meetings-view', {
        	url: '/meetings/:meetingId',
            templateUrl: 'views/meeting/view.html',
            controller: 'MeetingController'
        });
        
    $urlRouterProvider.otherwise('/');
    // $locationProvider.html5Mode(true);

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
});

var routesThatDontRequireAuth = ['/users/register','/users/login'];

// check if current location matches route  
var routeClean = function (route) {
return _.find(routesThatDontRequireAuth,
  function (noAuthRoute) {
    return _(route).startsWith(noAuthRoute);
  });
};
mitinApp.run(function ($rootScope, $state, $location,$cookieStore,$window, AuthService) {

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    	console.log('stateChangeStart...');
    	console.log(routeClean($location.url()));

    	var cuser;
    	if($window.sessionStorage.user) cuser = JSON.parse(window.sessionStorage.user)
    	console.log(cuser);
	    if (!routeClean($location.url()) && !cuser) {
	      // redirect back to login
	      $location.path('/login');
	    }else{
	    	  $rootScope.global = {
		        authenticated: !! cuser,
		        user: cuser
		      };
	    }

    });

});

mitinApp.controller('HeaderCtrl', function($scope, $rootScope,$cookieStore, AuthService){
	// $rootScope.$on('loggedin', function() {
	// 	console.log('headin');
	// 	var currentUserObject = $cookieStore.get('user');
 //      $scope.global = {
 //        authenticated: !!currentUserObject,
 //        user: currentUserObject.user
 //      };
 //    });
});

mitinApp.controller('MeetingController', function($scope,$location, $http, $stateParams, MeetingService){
	$scope.find = function(){
		$http.get('/meetings/all').success(function(data){
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
		console.log(isValid);
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

mitinApp.controller('UserCtrl', function($scope, $rootScope, $location, $stateParams,$state, $http,$cookieStore,$window, AuthService){
	$scope.user = {};
	$scope.login = function(){
		
		var success =function(userObject){
			$scope.loginError = 0;
	        // $rootScope.user = user;
	        // $cookieStore.put('user',$rootScope.user);
	        $window.sessionStorage.user = JSON.stringify(userObject.user);
	        $rootScope.$emit('loggedin');
	          // $location.path('/');
	          $state.go('user.home');
		};
		var error = function(){
	            $scope.loginerror = 'Authentication failed.';
		};
		AuthService.login($scope.user.email, $scope.user.password,success, error);
	};

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
		    $location.path('/');
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

mitinApp.controller('logoutCtrl', function($location,$window, $state,$rootScope, AuthService){

	AuthService.logout(function() {
		delete $window.sessionStorage.user;	
		// delete $cookieStore.user
		// $rootScope.$emit('loggedout');

        $rootScope.global = {
		        authenticated: false,
		        user: {}
		      };
        $state.go('user.login');
       }, function() {
            $rootScope.error = "Failed to logout";
     });
});