'use strict';
angular.module('meetingApp')
.controller('MenuCtrl', function($rootScope,$window, MenuService){
	var cuser;
	if('undefined' != $window.sessionStorage.user 
		&& 'undefined' != typeof($window.sessionStorage.user))
		cuser = JSON.stringify(JSON.parse($window.sessionStorage.user));
	
	$rootScope.menus = MenuService.menu(cuser);

    $rootScope.$on('loggedin', function() {
      if('undefined' != $window.sessionStorage.user &&
      		'undefined' != typeof($window.sessionStorage.user))
 			cuser = JSON.stringify(JSON.parse($window.sessionStorage.user));
      $rootScope.menus = MenuService.menu(cuser);
    });

	$rootScope.$on('loggedout', function() {
	  	$rootScope.menus = MenuService.menu('');
	});

});