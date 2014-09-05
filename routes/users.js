var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var meetings = require('../models/user.js');
var User = mongoose.model('User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.post('/register', function(req, res, next) {
 	var user = new User(req.body);
	user.provider = 'local';

	  req.assert('name', 'You must enter a name').notEmpty();
	  req.assert('email', 'You must enter a valid email address').isEmail();
	  req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
	  req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
	  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

	  var errors = req.validationErrors();
	  if (errors) {
	    return res.status(400).send(errors);
	  }
	  user.roles = ['authenticated'];
	  user.save(function(err) {
	    if (err) {
	      switch (err.code) {
	        case 11000:
	          res.status(400).send([{
	            msg: 'Email already taken',
	            param: 'email'
	          }]);
	          break;
	        case 11001:
	          res.status(400).send([{
	            msg: 'Username already taken',
	            param: 'username'
	          }]);
	          break;
	        default:
	          var modelErrors = [];
	          if (err.errors) {
	            for (var x in err.errors) {
	              modelErrors.push({
	                param: x,
	                msg: err.errors[x].message,
	                value: err.errors[x].value
	              });
	            }
	            res.status(400).send(modelErrors);
	          }
	      }
	      return res.status(400);
	    }
	    // return res.redirect('users/login');

	    req.logIn(user, function(err) {
	      if (err) return next(err);
	      return res.redirect('/');
	    });
	    res.status(200);
	  });

});


router.post('/login',function(req,res, next){
	passport.authenticate('local', function(err, user, info) {
	    console.log('In authenticate callback!');
	    if (err) return next(err);

	    if (!user) {
	      req.flash('errors', { msg: info.message });
	      res.status(401).json({message: info.message});
	    }
	      // res.json(user);
	      res.send({
	      	user: user
	      });
	    })(req, res, next);
});

router.get('/logout', function(req, res){
	req.logout();
 	res.redirect('/');
});

router.get('/loggedin', function(req, res) {
		console.log("loggedin");
	  res.send(req.isAuthenticated() ? req.user : '0');
	});

/* GET users listing. */
router.get('/', function(req, res) {
  // res.send('respond with a resource');
    User.find().exec(function(err, users) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the users'
      });
    }
    res.json(users);
  });
});

module.exports = router;
