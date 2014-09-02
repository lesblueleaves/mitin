var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var meetings = require('../models/user.js');
var User = mongoose.model('User');

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
