'use strict';
angular.module('meetingApp')
.controller('MenuCtrl', function($scope, $rootScope,$window, MenuService){
	
	var cuser;
	if($window.sessionStorage.user)
	 	cuser = JSON.stringify(JSON.parse($window.sessionStorage.user));
	$rootScope.menus = MenuService.menu(cuser);

    $rootScope.$on('loggedin', function() {
	      console.log('headin');
	      if($window.sessionStorage.user)
	 			cuser = JSON.stringify(JSON.parse($window.sessionStorage.user));
	      $rootScope.menus = MenuService.menu(cuser);
      });

	$rootScope.$on('loggedout', function() {
	  console.log('loggedout');
	  $rootScope.menus = MenuService.menu('');
	});

});