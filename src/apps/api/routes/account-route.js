var express = require('express');
var co = require('co');
var mongoose = require('mongoose');

var account = module.exports = express.Router();

var User = require('../models/user');
var userPresenter = require('../presenters/user-presenter');
var generateToken = require('../utils').generateToken;
var ensureAuth = require('../middlewares/ensure-auth');


account.post('/email-login', (req, res) => {
  var body = req.body;

  co(function *() {
    try {
      var user = yield User.findOne({ email: req.body.email }).exec();
      if(user && user.authenticate(body.password)) {
        var token = generateToken(user.email, user.password);
        user.token = token;
        var savedUser = yield user.save();
        res.json({
          user: userPresenter(savedUser),
          token: token
        });
      } else {
        throw new Error('User not found!!');
      }
    } catch (e) {
      res.json({
        message: e.message
      });
    }
  });
});


account.post('/register', (req, res) => {
  co(function *() {
    try {
      var user = yield new User(req.body).save();
      res.json(userPresenter(user));
    } catch (e) {
      res.status(400).json({
        message: e.message
      });
    }
  });
});


account.get('/me', ensureAuth, (req, res) => {
  res.json(userPresenter(req.user));
});

account.get('/me/followers', ensureAuth, (req, res) => {
  res.json(req.user.followers);
});

account.post('/follow', ensureAuth, (req, res) => {
  co(function *() {
    try {
      var followedUser = yield User.update({ _id: req.body.userId }, {
        $push: { followers: req.user._id }
      }, {
        upsert: true
      }).exec();

      var savedUser = yield User.update({ _id: savedUser._id }, {
        $push: { followed: followedUser._id }
      }).exec();

      res.json({
        success: true,
        followers: followedUser.followers
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });
});
