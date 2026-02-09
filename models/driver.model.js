const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverName: String,
  driverPhone: Number,

  drivingLicenseNo: String,
  licenseNumber: String,   // file path / URL
 licenseExpiry:Date,
  vehicleRC: String,           // file path / URL
  vehicleRegistrationNo: String,

  drivingRoute: String,        // city / area

  approvalStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },

  availabilityStatus: {
    type: String,
    enum: ['AVAILABLE', 'UNAVAILABLE'],
    default: 'AVAILABLE'
  }
});

module.exports = mongoose.model('Driver', driverSchema);