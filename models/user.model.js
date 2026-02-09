const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  contact:String,
  bookings: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Booking'
}]

});

module.exports = mongoose.model('User', userSchema);