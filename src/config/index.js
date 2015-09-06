var env = require('./env');

var runEnv = process.env.NODE_ENV || 'development';
module.exports = env[runEnv];
