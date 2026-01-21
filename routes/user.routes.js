 const express = require('express');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const userAuth = require('../middleware/userAuth');
const router = express.Router();

router.get('/user-login', (req, res) => {
  res.render('user-login');
});

router.post('/user-login', async (req, res) => {
  const contact= Number(req.body.contact);
  const user = await User.findOne({contact});
  console.log(req.body);
  if (!user) return res.send('Invalid credentials');

  req.session.userId = user._id;
  res.redirect('/user/bookings');
});

router.get('/user/bookings', userAuth, async (req, res) => {
 // const bookings = await Booking.find({ userEmail: req.session.user.email });
  const user = await User.findById(req.session.userId)
  .populate('bookings');

res.render('user-bookings', { bookings: user.bookings });

 res.render('user-bookings', { bookings });
});

router.get('/receipt/:id', userAuth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  res.render('receipt', { booking });
});

module.exports = router;
