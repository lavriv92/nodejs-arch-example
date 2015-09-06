function requireAuth (req, res, next) {
  if(!req.headers.authorization) {
    res.status(403).json({
      'message': 'Authentication failed '
    });
  } else {
    next();
  }
};

module.exports = requireAuth;
