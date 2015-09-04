var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var runCluster = require('./run-cluser');
var config = require('./config');
var api = require('./apps/api');

mongoose.connect(config.db);

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);


runCluster(app);
