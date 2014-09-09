var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , mongoose = require('mongoose')
    , AuthCtrl =  require('./server/controllers/auth.js')
    , UserCtrl =  require('./server/controllers/user.js')
    , MeetingCtrl = require('./server/controllers/meeting.js')
    // , User =      require('./models/User.js')
    , userRoles = require('./app/js/routingConfig').userRoles
    , accessLevels = require('./app/js/routingConfig').accessLevels;
var User = mongoose.model('User');

var routes = [

    // Views
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },

   // Local Auth
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
    // {
    //     path: '/logout',
    //     httpMethod: 'POST',
    //     middleware: [AuthCtrl.logout]
    // },
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

    // User resource
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

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            var role = userRoles.public, username = '';
            if(req.user) {
                role = req.user.role;
                username = req.user.username;
            }
            console.log(req.user);
            res.cookie('user', JSON.stringify({
                'username': username,
                'role': role
            }));
            // res.render('/index');
            res.send('default response');
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
    var role;
    if(!req.user) role = userRoles.public;
    else{
        // req.user.roles[0] = userRoles.admin;
      role = userRoles.admin; 
    }
    console.log('routing');
    console.log(req.route.path);
    // console.log(req.route.stack);
    var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.route.stack[0].method.toUpperCase() }).accessLevel || accessLevels.public;
    // if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    // if(!req.user && accessLevels != accessLevels.public) return res.send(401);
    if(!(accessLevel.bitMask & role.bitMask)) return res.send(401);
    return next();
}