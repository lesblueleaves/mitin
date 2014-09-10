var mongoose = require('mongoose')
  , Meeting = mongoose.model('Meeting');

module.exports ={
	all: function(req, res){
	  Meeting.find({}, function(err, meetings){
	  	res.json(meetings);
	  });
	},

	findOne: function(req, res){
		console.log('find one');
		console.log(req.params.meetingId);
		Meeting.findOne({'_id':req.params.meetingId}, function(err, meeting){
		if (err){
			console.error(err);
		}
		res.json(meeting);
	})
	},
	add: function(req, res){
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
	}
}