var express = require('express');
var co = require('co');
var mongoose = require('mongoose');

var account = module.exports = express.Router();

var User = require('../models/user');
var userPresenter = require('../presenters/user-presenter');
var generateToken = require('../utils').generateToken;
var ensureAuth = require('../middlewares/ensure-auth');


account.post('/email-login', function (req, res) {
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
        res.json({
          message: 'Unauthorized'
        });
      }
    } catch (e) {
      res.json(e.message);
    }
  });
});


account.post('/register', function (req, res) {
  co(function *() {
    try {
      var user = yield new User(req.body).save();
      res.json(userPresenter(user));
    } catch (e) {
      res.json(e.message);
    }
  });
});


account.get('/me', ensureAuth, function (req, res) {
  res.json(userPresenter(req.user));
});

account.get('/me/followers', ensureAuth, function (req, res) {
  res.json(req.user.followers);
});

account.post('/follow', ensureAuth, function (req, res) {
  co(function *() {
    try {
      var followedUser = yield User.findOne({ _id: req.body.userId }).exec();
      
      followedUser = yield followedUser.update({ $push: {
        followers: req.user._id
      }}).exec();

      var savedUser = yield req.user.update({ $push: {
        followed: followedUser._id
      }}).exec();

      res.json({
        success: true,
        followers: followedUser.followers
      });
    } catch (e) {
      console.log(e);
      res.json({
        message: e.message
      });
    }
  });
});
