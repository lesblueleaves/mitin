var mongoose = require('mongoose')
  , Meeting = mongoose.model('Meeting');

module.exports ={
	all: function(req, res){
	  Meeting.find({}, function(err, meetings){
	  	res.json(meetings);
	  });
	},

	findOne: function(req, res){
		Meeting.findOne({'_id':req.params.meetingId}, function(err, meeting){
		if (err){
			console.error(err);
		}
		res.json(meeting);
	})
	},
	add: function(req, res){
		var meeting = new Meeting(req.body);
		console.log(req.user);
		meeting.user =req.user.email;
		meeting.save(function(err){
			if (err) {
		      return res.json(500, {
		        error: 'Cannot save the meeting'
		      });
		    }
	    res.json(meeting);
		});
	}
}