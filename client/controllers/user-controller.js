'use strict';
angular.module('meetingApp')
.controller('UserCtrl', function($scope, $rootScope, $location, $stateParams,$state, $http,$window, AuthService){
    $scope.user = {};
    $scope.login = function(){
        var success =function(userObject){
        $scope.loginError = 0;
        $window.sessionStorage.user = JSON.stringify(userObject.user);
        $rootScope.$emit('loggedin');
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
})
.controller('logoutCtrl', function($location,$window, $state,$rootScope, AuthService){

  AuthService.logout(function() {
    delete $window.sessionStorage.user;
     $rootScope.$emit('loggedout');
    // delete $cookieStore.user
        $rootScope.global = {
            authenticated: false,
            user: {}
          };
        $state.go('user.login');
       }, function() {
            $rootScope.error = "Failed to logout";
     });
});