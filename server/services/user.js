var _ =           require('underscore')
    , mongoose = require('mongoose')
    // , User =      require('./models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , User = mongoose.model('User');

module.exports = {
    index: function(req, res) {
        var users = User.findAll();
        res.json(users);
    },
    findAll:function(req, res){
        User.find().exec(function(err, users) {
         if (err) {
            return res.json(500, {
             error: 'Cannot list the users'
            });
        }
            res.json(users);
        });
      },
    loggedin:function(req, res){
        // console.log(req.user);
        res.send(req.isAuthenticated() ? req.user : '0');
    },
    findMails:function(req, res){
         User.find().select('email').exec(function(err, users) {
         if (err) {
            return res.json(500, {
             error: 'Cannot list mails of users'
            });
        }
            // console.log(users);
            res.json(users);
        }); 
    }
};