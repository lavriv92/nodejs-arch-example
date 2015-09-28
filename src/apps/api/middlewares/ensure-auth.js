var User = require('../models/user');
var co = require('co');


module.exports = (req, res, next) => {
  var token = req.headers.authorization;

  co(function *() {
    try {
      var user = yield User.findOne({ token: token }).exec();
      if (user) {
        req.user = user;
        next();
      } else {
        throw new Error("User is undefined");
      }
    } catch (e) {
      res.status(403).json(e.message);
    }
  });
};
