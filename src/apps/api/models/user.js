var mongoose = require('mongoose');
var cryptPassword = require('../../../utils').cryptPassword;

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, set: cryptPassword },
  firstName: { type: String },
  lastName: { type: String },
  token: { type: String, default: null },
  avatar: { type: String, default: null },

  followers: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  followed: [{type: mongoose.Types.ObjectId, ref: 'User'}]
});

userSchema.methods.authenticate = function (password) {
  return this.password === cryptPassword(password);
};

module.exports = mongoose.model('User', userSchema);
