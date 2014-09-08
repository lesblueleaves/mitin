var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , mongoose = require('mongoose')
    , AuthCtrl =  require('./server/controllers/auth.js')
    , UserCtrl =  require('./server/controllers/user.js')
    // , User =      require('./models/User.js')
    , userRoles = require('./client/js/routingConfig').userRoles
    , accessLevels = require('./client/js/routingConfig').accessLevels;
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

    // User resource
    {
        path: '/users',
        httpMethod: 'GET',
        middleware: [UserCtrl.findAll],
        accessLevel: accessLevels.admin
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
            res.cookie('user', JSON.stringify({
                'username': username,
                'role': role
            }));
            res.render('index');
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
    // console.log("ensureAuthorized");
    // console.log(req.user);
    if(!req.user) role = userRoles.public;
    else          {
        req.user.roles[0] = userRoles.admin;
      role = req.user.roles[0];  
    }
    var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.route.stack[0].method.toUpperCase() }).accessLevel || accessLevels.public;

    if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    return next();
}