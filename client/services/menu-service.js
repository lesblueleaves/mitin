'use strict';

angular.module('meetingApp')
.factory('MenuService',function(){

	return {
		menu: function(loggin){
			var mainMenu=[];
			if(!!loggin){
				mainMenu.push({itemText:"Meetings",itemLink:"meeting.all"});
				mainMenu.push({itemText:"Create New Meeting",itemLink:"meeting.create"});
				mainMenu.push({itemText:"Groups",itemLink:"#"});
				mainMenu.push({itemText:"Create New Meeting",itemLink:"#"});
			}
			return mainMenu;
		}
 }
});