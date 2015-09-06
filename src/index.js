var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var runCluster = require('./run-cluser');
var config = require('./config');
var api = require('./apps/api');

mongoose.connect(config.db, function (err) {
  if(err) {
    console.log(err);
  }
});

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '123456789',
  resave: true,
  saveUninitialized: true
}));
app.use('/api', api);


runCluster(app);
