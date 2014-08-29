'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meeting Schema
 */
var MeetingSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {  
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    // type: Schema.ObjectId,
    // ref: 'User'
    type: String,
    trim: true
  },
  recips:{
    type: String,
    trim: true
  },
  starttime:{
    type: Date,
    require: true,
    default: Date.now
  },
  endtime:{
    type: Date,
    require: true,
    default: Date.now
  }
});

// MeetingSchema.statics.load = function(id,cb){
//   this.findOne({
//     _id: id
//   }).populate('user', 'name username').exec(cb);
// };

mongoose.model('Meeting', MeetingSchema);