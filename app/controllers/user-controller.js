'use strict';
var userApp = angular.module('userApp',['ui.router']);
userApp.config(function($urlRouterProvider,$stateProvider){
	  $stateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: 'views/user/index.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: 'views/user/login.html'
        // resolve: {
        //   loggedin: checkLoggedOut
        // }
      })
      .state('register', {
        url: '/users/register',
        templateUrl: 'views/user/register.html'
        // resolve: {
        //   loggedin: checkLoggedOut
        // }
      })
});

angular.bootstrap($('#app2'),['userApp']);