const express = require('express');
const Booking = require('../models/booking.model');
const router = express.Router();

router.get('/pay/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  const success = Math.random() > 0.3; // backend decides

  booking.paymentStatus = success ? 'SUCCESS' : 'FAILED';
  booking.receiptId = success ? `RCPT-${Date.now()}` : null;

  await booking.save();

  if (success) {
    res.render('paid2', { booking });
  } else {
    res.render('payment-failed');
  }
});

module.exports = router;