const express = require('express');
const Driver = require('../models/driver.model');
const Booking = require('../models/booking.model');
const router = express.Router();

// show registration form
router.get('/driver/register', (req, res) => {
  res.render('driver-register');
});

// submit registration
router.post('/driver/register', async (req, res) => {
  try {
    const driver = new Driver(req.body);
    driver.approvalStatus='PENDING';
    driver.availabilityStatus='UNAVAILABLE'
    await driver.save();

    res.render('wait');

  } catch (err) {
    console.error(err);
    res.send("Error registering driver");
  }
});
router.get('/select-driver', async (req, res) => {
  try {
    //const booking = await Booking.findById(req.params.bookingId);
    //if (!booking) return res.send("Booking not found");

    const drivers = await Driver.find({
      approvalStatus: 'APPROVED',
      availabilityStatus: 'AVAILABLE'
    });

    res.render('select-driver', { drivers });
  } catch (err) {
    console.error(err);
    res.send("Error loading drivers");
  }
});

module.exports = router;

// View available drivers (for users)
/*router.get('/select-driver', async (req, res) => {
  try {
    const drivers = await Driver.find({
      approvalStatus: 'APPROVED',
      availabilityStatus: 'UNAVAILABLE'
    });

    res.render('select-driver', { drivers });

  } catch (err) {
    console.error(err);
    res.send("Unable to load drivers");
  }
});*/
