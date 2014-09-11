'use strict';
angular.module('meetingApp')
.controller('UserCtrl', function($scope, $rootScope,$state,$window, AuthService){
    $scope.user = {};
   
    $scope.login = function(){
        var success =function(userObject){
        $scope.loginError = 0;
        console.log(userObject);
        $window.sessionStorage.user = JSON.stringify(userObject.user);
        $rootScope.$emit('loggedin');
        $rootScope.global = {
           authenticated: !!userObject.user,
           user: userObject.user
        };
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
      var regUser={};
      regUser.email= $scope.user.email;
      regUser.password = $scope.user.password;
      regUser.confirmPassword = $scope.user.confirmPassword;
      regUser.username = $scope.user.username;
      regUser.name = $scope.user.name;

      AuthService.register(regUser,function(userObject){
           $scope.registerError = 0;
            $window.sessionStorage.user = JSON.stringify(userObject.user);
            $rootScope.$emit('loggedin');
            $rootScope.global = {
             authenticated: !!userObject.user,
             user: userObject.user
           };
            $state.go('user.home');
        }, function(error){
          if (error === 'Username already taken') {
            $scope.usernameError = error;
          } else if (error === 'Email already taken') {
            $scope.emailError = error;
          } else $scope.registerError = error;
        });
    };
})
.controller('logoutCtrl', function($window, $state,$rootScope, AuthService){
  AuthService.logout(function() {
    delete $window.sessionStorage.user;
      $rootScope.$emit('loggedout');
      $rootScope.global = {
           authenticated: false,
           user: ''
        };
      $state.go('user.login');
       }, function() {
          $rootScope.error = "Failed to logout";
     });
});