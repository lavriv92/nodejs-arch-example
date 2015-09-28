var express = require('express');

var account = require('./routes/account-route');
trips = require('./routes/trips-route');

var api = express.Router();

api.use('/account', account);
api.use('/trips', trips);

module.exports = api;
