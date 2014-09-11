'use strict';

angular.module('meetingApp')
.factory('AuthService', function($http, $cookieStore){
    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        // , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };
        , currentUser;

    // $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined) {
                role = currentUser.role;
            }
            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            $http.get('/users/loggedin').success(function(user){
             currentUser = user;
        });
            return currentUser;
        },
        register: function(user, success, error) {
            $http.post('/users/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login:function(email,pass,success,error){
            $http.post('/users/login', {
              email: email,
              password: pass
            }).success(function(res){
                // changeUser(res);
                currentUser = res;
                // console.log(res);
                success(res);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/users/logout').success(function(){
                currentUser=null;
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});