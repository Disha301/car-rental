const express = require('express');
const Admin = require('../models/admin.model');
const Booking = require('../models/booking.model');
const Car = require('../models/car.model');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();
const adminUser ={
  username:"admin",
  password:"admin123"
}
router.get('/admin/login', (req, res) => {
  res.render('admin-login');
});

router.post('/admin/login',  (req, res) => {
  const { username, password } = req.body;

    if (username === adminUser.username && password === adminUser.password) {
        // Successful login, redirect to dashboard
        req.session.admin =adminUser;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Invalid admin credentials');
    }
});

  /*const admin = await Admin.findOne(req.body);
  if (!admin) return res.send('Invalid admin');

  req.session.admin = admin;
  res.redirect('/admin/dashboard');*/



router.get('/admin/dashboard', adminAuth, async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const totalCars = await Car.countDocuments();

  const revenueAgg = await Booking.aggregate([
    { $match: { paymentStatus: 'SUCCESS' } },
    { $group: { _id: null, sum: { $sum: "$totalCost" } } }
  ]);

  const totalRevenue = revenueAgg[0]?.sum || 0;

  res.render('admin-dashboard', {
    totalBookings,
    totalCars,
    totalRevenue
  });
});

router.get('/admin/bookings', adminAuth, async (req, res) => {
  const bookings = await Booking.find();
  res.render('admin-bookings', { bookings });
});

router.get('/admin/cars', adminAuth, async (req, res) => {
  const cars = await Car.find();
  res.render('admin-cars', { cars });
});

router.post('/admin/cars/add', adminAuth, async (req, res) => {
  await Car.create(req.body);
  res.redirect('/admin/cars');
});

module.exports = router