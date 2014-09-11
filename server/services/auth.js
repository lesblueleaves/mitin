var passport =  require('passport')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')

module.exports ={
	register: function(req, res, next){
		var user = new User(req.body);
		user.provider = 'local';

		req.assert('name', 'You must enter a name').notEmpty();
		req.assert('email', 'You must enter a valid email address').isEmail();
		req.assert('password', 'Password must be between 3-20 characters long').len(3, 20);
		req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
		req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

		var errors = req.validationErrors();
		if (errors) {
			console.log(err);
		return res.status(400).send(errors);
		}
		user.roles = ['authenticated'];
		user.save(function(err) {
		if (err) {
			console.log(err);
		  	return res.send(400);
		  }
		});
		req.logIn(user, function(err) {
		  if (err) return next(err);
		  return res.redirect('/');
		});
		res.json(200,{"user":user});
	  },

login: function(req, res, next){
		passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);
		if (!user) {
			req.flash('errors', { msg: info.message });
			// res.status(401).json({message: info.message});
			return res.send(401, info.message);
		}
		req.logIn(user, function(err) {
		  if (err) return next(err);
			res.json(200, { "user": user});
		});
	})(req, res, next);
 },

 logout: function(req, res){
 	  req.logout();
      res.send(200);
 }	 
};