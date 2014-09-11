var mitinApp = angular.module('meetingApp',['ngCookies', 'meetingApp.MeetingService','ui.router','underscore']);

mitinApp.config(function($stateProvider, $urlRouterProvider,$httpProvider,$locationProvider) {
    $stateProvider
    	.state('404', {
	            url: '/404',
	            templateUrl: 'views/404.html'
	        })
    	.state('user', {
	            url:'/users',
	            templateUrl: "views/user/index.html"
	        })
    	.state('user.home', {
	            url:'/home',
	            templateUrl: "views/home.html"
	        })
	   	.state('user.register', {
	        url: '/register',
	        templateUrl: 'views/user/register.html',
	        controller: 'UserCtrl'
      	})
        .state('user.login', {
	        url: '/login',
	        templateUrl: 'views/user/login.html',
	        controller: 'UserCtrl'
      	})
      	.state('user.logout', {
	        url: '/logout',
	        controller: 'logoutCtrl'
      	})
      	.state('meeting', {
	        url: '/meetings',
	        templateUrl: "views/meeting/index.html"
      	})
        .state('meeting.all', {
            url: '/all',
            templateUrl: 'views/meeting/list.html',
            controller: 'MeetingController'
        })
        .state('meeting.create', {
        	url: '/create',
            templateUrl: 'views/meeting/create.html',
            controller: 'MeetingController'
        })
		.state('meeting.view', {
        	url: '/:meetingId',
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
    	console.log(routeClean($location.url()));

    	var cuser;
    	if($window.sessionStorage.user) cuser = JSON.parse(window.sessionStorage.user)
	    if (!routeClean($location.url()) && !cuser) {
	      // redirect back to login
	     	// console.log('relogin');
	      $location.path('/login');
	      // $state.go('user.login');
	    }else{
	    	  $rootScope.global = {
		        authenticated: !! cuser,
		        user: cuser
		      };
	    }
    });
});
