var express = require('express');
var co = require('co');

var Trip = require('../models/Trip');
var tripPresenter = require('../presenters/trip-presenter');
var ensureAuth = require('../middlewares/ensure-auth');

var trips = express.Router();

trips.get('/', (req, res) => {
  var page = req.body.page || 1;
  co(function *() {
    try {
       var trips = yield Trip.find({ creator: req.user._id }).exec();
       res.json({ trips: trips });
    } catch (e) {
      res.json(e);
    }
  });
});

trips.get('/:id', (req, res) => {
  co(function *() {
    try {
      var trip = yield Trip.findOne({
        _id: req.params.id,
        creator: req.user._id
      }).exec();
      res.json(tripPresenter(trip));
    } catch (e) {
      res.json({
        message: e.message
      })
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
      var trip = yield Trip.update({ _id: req.body.tripId }, {
        $push: { subscribers: req.user._id }
      }).exec();
      res.json({ success: true });
    } catch(e) {
      res.json(e);
    }
  });
});

module.exports = trips;
