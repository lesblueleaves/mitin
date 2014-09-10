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
            console.log('currentUser');
            console.log(currentUser);
            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            $http.get('/users/loggedin').success(function(user){
             currentUser = user;
        });
            return currentUser;
            // if(user === undefined) {
            //     user = currentUser;
            // }
            // return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/users/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        // login: function(user, success, error) {
        //     $http.post('/uses/login', user).success(function(user){
        //         changeUser(user);
        //         success(user);
        //     }).error(error);
        // },
        login:function(email,pass,success,error){
            $http.post('/users/login', {
              email: email,
              password: pass
            }).success(function(res){
                // changeUser(res);
                currentUser = res;
                console.log(res);
                success(res);
            }).error(error);
        },
        logout: function(success, error) {
            console.log('logout');
            $http.post('/users/logout').success(function(){
                // changeUser({
                //     username: '',
                //     role: userRoles.public
                // });
                currentUser=null;
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});