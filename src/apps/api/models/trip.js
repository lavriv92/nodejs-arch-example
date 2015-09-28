var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

var tripSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  creator: { type: Number, ref: 'User'},
  //points: [{ type: ObjectId, ref: 'Point' }],
  subscribers: [{ type: ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Trip', tripSchema);
