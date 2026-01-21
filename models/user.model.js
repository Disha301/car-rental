const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  contact:Number,
  bookings: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'booking'
}]

});

module.exports = mongoose.model('User', userSchema);