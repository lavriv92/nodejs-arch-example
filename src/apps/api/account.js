var express = require('express');


var account = module.exports = express.Router();

var User = require('../../models/User.js');
var generateToken = require('../../utils').generateToken;
var requireAuth = require('./middlewares').requireAuth;


account.post('/email-login', function (req, res) {
  var body = req.body;
  User.findOne({ email: body.email }, {
    email: 1,
    password: 1,
    token: 1
  }).exec(function (err, user) {
    if(err)  {
      res.json(err);
    } else {
      if(user && user.authenticate(body.password)) {
        var token = generateToken(user.email, user.password);
        user.token = token;
        user.save(function(err, user) {
          req.session.user = user;
          res.json({ token: token });
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
      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }, 201);
    }
  });
});


account.get('/current', requireAuth, function (req, res) {
  res.json(req.session.user);
});
