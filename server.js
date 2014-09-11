var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose'); 
// var path = require('path');
// var favicon = require('static-favicon');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var http = require('http');
var flash = require('connect-flash');

require('./server/models/user.js');
require('./server/models/meeting.js');


// require('./config/passport.js');
var app = express();
app.use(express.static(__dirname + '/client'));

var User = mongoose.model('User');

mongoose.connect('mongodb://localhost:27017/abc');


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

// app.use(logger());
app.use(flash());

require('./server/routes.js')(app);

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

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
	 User.findOne({
		    email: id
		  }, function(err, user) {
		    done(null, user);
		  });
});

app.set('port', process.env.PORT || 9000);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

