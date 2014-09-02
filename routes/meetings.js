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

router.get('/:meetingId', function(req, res) {
	Meeting.findOne({'_id':req.params.meetingId}, function(err, meeting){
		console.log(meeting);
		if (err){
			console.error(err);
		}
		res.json(meeting);

	})
});

router.post('/add',function(req, res){
	var meeting = new Meeting(req.body);
	meeting.user ="111111011";
	meeting.save(function(err){
		if (err) {
	      return res.json(500, {
	        error: 'Cannot save the meeting'
	      });
	    }
    res.json(meeting);
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