var _ =       require('underscore')
    ,_str = require('underscore.string')
    , path =      require('path')
    , passport =  require('passport')
    , mongoose = require('mongoose')
    , AuthCtrl =  require('./services/auth.js')
    , UserCtrl =  require('./services/user.js')
    , MeetingCtrl = require('./services/meeting.js')

var User = mongoose.model('User');

var routes = [

   // users
    {
        path: '/users/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register]
    },
    {
        path: '/users/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/users/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
    },
    {
        path: '/users',
        httpMethod: 'GET',
        middleware: [UserCtrl.findAll]
    },
    {
        path:'/users/loggedin',
        httpMethod: 'GET',
        middleware: [UserCtrl.loggedin]
    },
    {
        path:'/users/mail',
        httpMethod: 'GET',
        middleware: [UserCtrl.findMails]
    },
    //====== Meetings
    {
        path: '/meetings/all',
        httpMethod:'GET',
        middleware:[MeetingCtrl.all]
    },
    {
        path: '/meetings/:meetingId',
        httpMethod:'GET',
        middleware:[MeetingCtrl.findOne]
    },
    {
        path: '/meetings/add',
        httpMethod:'POST',
        middleware:[MeetingCtrl.add]
    },

    
    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            res.sendfile('./client/index.html'); 
        }]
    }
];

module.exports = function(app) {

    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);
        // console.log(args);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthorized(req, res, next) {
  
    var routesThatDontRequireAuth = ['/users/register','/users/login'];

    var routeClean = function (route) {
    return _.find(routesThatDontRequireAuth,
      function (noAuthRoute) {
        // return _str(route).startsWith(noAuthRoute);
        return _str.startsWith(route, noAuthRoute);
      });
    };

    if(!routeClean(req.route.path) && !req.user) return res.send(401);
    return next();
}