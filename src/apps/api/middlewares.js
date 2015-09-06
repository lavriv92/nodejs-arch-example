
exports.requireAuth = function (req, res, next) {
  var unautorized = !req.session.user ||
                    req.headers.authorization !== req.session.user.token
  if(unautorized) {
    res.json({
      'message': 'Authentication failed '
    }, 401);
  } else {
    next();
  }
};
