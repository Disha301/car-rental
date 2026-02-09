 const express = require('express');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const userAuth = require('../middleware/userAuth');
const router = express.Router();

router.get('/user-login', (req, res) => {
  res.render('user-login');
});


  router.post('/user-login', async (req, res) => {
  const contact = req.body.contact.trim();

  const user = await User.findOne({ contact });
  console.log("LOGIN ATTEMPT:", contact, user);

  if (!user) {
    return res.send('Invalid credentials');
  }

  req.session.userId = user._id;

  req.session.save(() => {
    res.redirect('/user/bookings');
  });
});


router.get('/user/bookings', userAuth, async (req, res) => {
  const user = await User.findById(req.session.userId)
    .populate({
      path: 'bookings',
      populate: {
        path: 'driverId',
        model: 'Driver'
      }
    });

  res.render('user-bookings', { bookings: user.bookings });
});

router.get('/receipt/:id', userAuth, async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.session.userId
  }).populate('driverId');

  if (!booking) {
    return res.status(404).send("Receipt not found or access denied");
  }

  res.render('response', { booking });
});


module.exports = router;
