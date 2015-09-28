var mongoose = require('mongoose');
var cryptPassword = require('../utils').cryptPassword;

var ObjectId = mongoose.Types.ObjectId;

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, set: cryptPassword },
  firstName: { type: String },
  lastName: { type: String },
  address: {
    city: { type: String, default: null },
    street: { type: String, default: null }
  },
  token: { type: String, default: null },
  avatar: { type: String, default: null },

  followers: [{type: String, ref: 'User' }],
  followed: [{type: String, ref: 'User' }]
});


userSchema.methods.authenticate = (password) => {
  return this.password === cryptPassword(password);
};

module.exports = mongoose.model('User', userSchema);
