var _ =       require('underscore')
    ,_str = require('underscore.string')
    , path =      require('path')
    , passport =  require('passport')
    , mongoose = require('mongoose')
    , AuthCtrl =  require('./services/auth.js')
    , UserCtrl =  require('./services/user.js')
    , MeetingCtrl = require('./services/meeting.js')
    // , User =      require('./models/User.js')
    , userRoles = require('../client/js/routingConfig').userRoles
    , accessLevels = require('../client/js/routingConfig').accessLevels;

var User = mongoose.model('User');

var routes = [

   // users
    {
        path: '/users/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register]
        // accessLevel: accessLevels.public
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
        middleware: [UserCtrl.findAll],
        accessLevel: accessLevels.admin
    },
    {
        path:'/users/loggedin',
        httpMethod: 'GET',
        middleware: [UserCtrl.loggedin]
        // accessLevel: accessLevels.admin
    },
    {
        path:'/users/mail',
        httpMethod: 'GET',
        middleware: [UserCtrl.findMails]
        // accessLevel: accessLevels.admin
    },
    //====== Meetings
    {
        path: '/meetings/all',
        httpMethod:'GET',
        middleware:[MeetingCtrl.all],
        accessLevel: accessLevels.user
    },
    {
        path: '/meetings/:meetingId',
        httpMethod:'GET',
        middleware:[MeetingCtrl.findOne],
        accessLevel: accessLevels.admin
    },
    {
        path: '/meetings/add',
        httpMethod:'POST',
        middleware:[MeetingCtrl.add],
        accessLevel: accessLevels.admin
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
        console.log(args);

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
    // var role;
    // if(!req.user) role = userRoles.public;
    // else{
    //     // req.user.roles[0] = userRoles.admin;
    //   role = userRoles.admin; 
    // }
    // console.log(req.route.path);
    // // console.log(req.route.stack);
    // var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.route.stack[0].method.toUpperCase() }).accessLevel || accessLevels.public;
    // // if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    // // if(!req.user && accessLevels != accessLevels.public) return res.send(401);
    // if(!(accessLevel.bitMask & role.bitMask)) return res.send(401);
    // return next();

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