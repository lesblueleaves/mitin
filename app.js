var express = require('express');
var mongoose = require('mongoose'); 
// var path = require('path');
// var favicon = require('static-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var meetings = require('./routes/meetings');

var app = express();
app.use(express.static(__dirname + '/app'));

mongoose.connect('mongodb://localhost:27017/rock')
// app.use(express.urlencoded());
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(favicon());
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/meetings', meetings);

app.listen(9000)
console.log("server started at 9000");
module.exports = app;
