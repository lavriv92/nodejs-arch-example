var express = require('express');
var co = require('co');
var mongoose = require('mongoose');

var account = module.exports = express.Router();

var User = require('../models/user');
var userPresenter = require('../presenters/user-presenter');
var generateToken = require('../utils').generateToken;
var ensureAuth = require('../middlewares/ensure-auth');


account.get('/all', (req, res) => {
  co(function *() {
    try {
      var users = User.find().exec();
    } catch(e) {
      res.status(500).json({
        message: e.message
      });
    }
  });
});


account.post('/email-login', (req, res) => {
  var body = req.body;

  console.log(body);

  co(function *() {
    try {
      var user = yield User.findOne({ email: body.email }).exec();
      if(user && user.authenticate(body.password)) {
        var token = generateToken(user.email, user.password);
        user.token = token;
        var savedUser = yield user.save();
        res.json({
          user: userPresenter(savedUser),
          token: token
        });
      } else {
        throw new Error('User not found!! or password failed');
      }
    } catch (e) {
      res.status(403).json({
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

account.put('/update', ensureAuth, (req, res) => {
  co(function *() {
    try {
      var user = yield User.update({_id: req.user._id}, req.data).exec();
      var user = yield User.findOne({_id: req.user._id }).exec();
      console.log(user);
      res.json(userPresenter(user));
    } catch (e) {
      res.status(400).json({
        message: e.message
      });
    }
  });
});

account.put('/update-password', ensureAuth, function () {
  co(function *() {
    try {
      if(req.body.newPassword === req.body.newPasswordConfirm) {
        var result = yield User.update({_id: req.user._id}, {
          password: req.body.newPassword
        }).exec();
        res.json(res);
      } else {
        throw new Error('Old password doe`s not equal new password');
      }
    } catch (e) {
      res.status(400).json({
        message: e.message
      })
    };
  });
});

account.get('/followed', ensureAuth, (req, res) => {
  co(function *() {
    try {
      var user = yield User.findOne({
        _id: req.user._id
      }).populate('followed').exec();
      var result = yield user.followed.map((u) => {
        return userPresenter(u);
      });
      res.json(result);
    } catch(e) {
      res.status(500).json({
        message: e.message
      })
    }

  });
});

account.get('/followers', ensureAuth, (req, res) => {
  co(function *() {
    try {
      var user = User.findOne({
        _id: req.user._id
      }).populate('followers').exec();
      var result = yield user.followers.map((u) => {
        return userPresenter(u);
      });
      res.json(result);
    } catch(e) {
      res.status(500).json({
        message: e.message
      });
    }
  });
});

account.post('/follow', ensureAuth, (req, res) => {
  co(function *() {
    try {
      var followedUser = yield User.update({ _id: req.body.userId }, {
        $push: { followers: req.user._id }
      }, {
        upsert: true
      }).exec();

      var savedUser = yield User.update({ _id: req.user._id }, {
        $push: { followed: req.body.userId }
      }, {
        upsert: true
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
