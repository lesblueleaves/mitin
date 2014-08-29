var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var meetings = require('../models/meeting.js');
var Meeting = mongoose.model('Meeting');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a meeting');
});

router.get('/all', function(req, res) {
  Meeting.find({}, function(err, meetings){
  	res.json(meetings);
  });
});

router.get('/init', function(req,res){
	Meeting.create({
		user:"10000100",
		title: "need init",
		content: 'init content',
		recips:'10000101@monkey.com'
	}, function(err, meeting){
		if(err) res.send(err);
		res.json(meeting);
	});
});

module.exports = router;