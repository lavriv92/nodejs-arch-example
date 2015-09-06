var express = require('express');

var account = module.exports = express.Router();

var User = require('../models/user');
var userPresenter = require('../presenters/user-presenter');
var generateToken = require('../utils').generateToken;
var requireAuth = require('../middlewares/require-auth');


account.post('/email-login', function (req, res) {
  var body = req.body;
  User.findOne({ email: body.email }, {
    token: 0,
    followers: 0,
    followed: 0
  }).exec(function (err, user) {
    if(err)  {
      res.json(err);
    } else {
      if(user && user.authenticate(body.password)) {
        var token = generateToken(user.email, user.password);
        user.token = token;
        user.save(function(err, user) {
          res.json({ token: token, user: userPresenter(user) });
        });
      }
    }
  });
});


account.post('/register', function (req, res) {
  new User(req.body).save(function (err, user) {
    if(err) {
      res.json(err);
    } else {
      res.json(userPresenter(user), 201);
    }
  });
});


account.get('/current', requireAuth, function (req, res) {
  res.json(userPresenter(req.user));
});
