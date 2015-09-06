function requireAuth (req, res, next) {
  if(req.headers.authorization) {
    res.json({
      'message': 'Authentication failed '
    }, 403);
  } else {
    next();
  }
};

module.exports = requireAuth;
