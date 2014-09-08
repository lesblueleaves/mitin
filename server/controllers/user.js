var _ =           require('underscore')
    , mongoose = require('mongoose')
    // , User =      require('./models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , User = mongoose.model('User');

module.exports = {
    index: function(req, res) {
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
            delete user.twitter;
            delete user.facebook;
            delete user.google;
            delete user.linkedin;
        });
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
        }
};