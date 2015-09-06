var User = require('../models/user');

function ensureAuth (req, res, next) {
  var token = req.headers.authorization;
  if(!req.headers.authorization) {
    res.status(403).json({
      'message': 'Authentication failed '
    });
  } else {
    User.findOne({ token: token }, {
      followed: 0,
      followers: 0
    }).exec(function (err, user) {
      if(err) {
        res.json(err);
      } else {
        req.user = user;
        next();
      }
    });
  }
};

module.exports = ensureAuth;
