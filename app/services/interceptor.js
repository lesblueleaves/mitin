module.factory('srInterceptor', ['$log', function($log) {
    $log.debug('$log is here to show you that this is a regular factory with injection');
    var srInterceptor = {
		console.log("intercepting...");   
    };
    return srInterceptor;
}]);