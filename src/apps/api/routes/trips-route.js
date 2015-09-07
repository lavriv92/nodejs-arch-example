var express = require('express');
var co = require('co');

var Trip = require('../models/Trip');
var tripPresenter = require('../presenters/TripPresenter');
var ensureAuth = require('../middlewares/ensure-auth');

var trips = express.Router();

trips.get('/', function (req, res) {
  var page = req.body.page || 1;
});

trips.post('/', ensureAuth, function (req, res) {
  try {
    var trip = new Trip(req.body).save();
    res.json(tripPresenter(trip));
  } catch (e) {
    res.json(e);
  }
});

trips.post('/subscribe', function () {

});

module.exports = trips;
