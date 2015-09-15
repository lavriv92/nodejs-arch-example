var express = require('express');
var co = require('co');

var Trip = require('../models/Trip');
var tripPresenter = require('../presenters/TripPresenter');
var ensureAuth = require('../middlewares/ensure-auth');

var trips = express.Router();

trips.get('/', (req, res) => {
  var page = req.body.page || 1;
  co(function *() {
    try {
       var trips = yield Trip.find().exec();
       res.json({ trips: trips });
    } catch (e) {
      res.json(e);
    }
  });
});

trips.post('/', ensureAuth, (req, res) => {
  co(function *() {
    try {
      var trip = yield new Trip(req.body).save();
      res.json(tripPresenter(trip));
    } catch (e) {
      res.json(e);
    }
  });
});

trips.post('/subscribe', ensureAuth, (req, res) => {
  co(function *() {
    try {
      var trip = yield Trip.findOne({ _id: req.body.tripId }).exec();
      trip.subscribers.push(req.user._id);
      trip = yield trip.save();
      res.json(trip);
    } catch(e) {
      res.json(e);
    }
  });
});

module.exports = trips;
