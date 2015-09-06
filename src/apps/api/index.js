var express = require('express');

var account = require('./routes/account-route');

var api = express.Router();

api.use('/account', account);

module.exports = api;
