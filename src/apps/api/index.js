var express = require('express');

var account = require('./account');

var api = express.Router();

api.use('/account', account);

module.exports = api;
