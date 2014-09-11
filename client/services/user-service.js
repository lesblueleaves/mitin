'use strict';

angular.module('meetingApp')
.factory('AuthService', function($http, $cookieStore){
    var  currentUser;

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        register: function(regUser, success, error) {
            $http.post('/users/register', {
                email: regUser.email,
                password: regUser.password,
                confirmPassword: regUser.confirmPassword,
                username: regUser.username,
                name: regUser.name
              })
            .success(function(res){
                success(res);
            })
            .error(function(res) {
                error(error);
            });
        },
        login:function(email,pass,success,error){
            $http.post('/users/login', {
              email: email,
              password: pass
            }).success(function(res){
                currentUser = res;
                success(res);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/users/logout').success(function(){
                currentUser=null;
                success();
            }).error(error);
        },
        user: currentUser
    };
});