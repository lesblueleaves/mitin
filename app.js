var express = require('express');
var mongoose = require('mongoose'); 
// var path = require('path');
// var favicon = require('static-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');


var routes = require('./routes/index');
var users = require('./routes/users');
var meetings = require('./routes/meetings');

// require('./config/passport.js');
var app = express();
app.use(express.static(__dirname + '/app'));

var User = mongoose.model('User');

mongoose.connect('mongodb://localhost:27017/mean-dev');


// app.use(favicon());
// app.use(logger('dev'));
app.use(cookieParser());
app.use(session({ secret: 'SPRINGROLL' }));
// app.use(session({ cookie: { maxAge: 60000 }}));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

// Use passport session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', routes);
app.use('/users', users);
app.use('/meetings', meetings);



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
	function(email, password, done) {
	  User.findOne({
	    email: email
	  }, function(err, user) {
	    if (err) {
	      return done(err);
	    }
	    if (!user) {
	      return done(null, false, {
	        message: 'Unknown user'
	      });
	    }
	    if (!user.authenticate(password)) {
	      return done(null, false, {
	        message: 'Invalid password'
	      });
	    }
	    return done(null, user);
	  });
	}
));

app.listen(9000)
console.log("server started at 9000");
module.exports = app;
