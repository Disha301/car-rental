const express = require('express');
const Admin = require('../models/admin.model');
const Booking = require('../models/booking.model');
const Car = require('../models/car.model');
const adminAuth = require('../middleware/adminAuth');
const Driver= require('../models/driver.model');
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

/*router.get('/admin/drivers', adminAuth, async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.render('admin-drivers', { drivers });
  } catch (err) {
    console.error(err);
    res.send("Error fetching drivers");
  }
});*/
// Admin view all drivers and pending requests
router.get('/admin/drivers', adminAuth, async (req, res) => {
  try {
    // Fetch all drivers and include number of bookings and history
    const drivers = await Driver.find();

    // For each driver, get total bookings and booking history
    const driverData = await Promise.all(drivers.map(async (driver) => {

      // Update availability if approved
      if (driver.approvalStatus === 'APPROVED' && driver.availabilityStatus !== 'AVAILABLE') {
        driver.availabilityStatus = 'AVAILABLE';
        await driver.save();
      }

      const bookings = await Booking.find({ driverId: driver._id })
        .select('customerName destination pickup contact startDate endDate');
      return {
       // ...driver.toObject(),
       _id: driver._id,
        driverName: driver.driverName,
        driverPhone: driver.driverPhone,
        vehicleRegistrationNo: driver.vehicleRegistrationNo,
        drivingRoute: driver.drivingRoute,
        approvalStatus: driver.approvalStatus,
        availabilityStatus: driver.availabilityStatus,
        totalBookings: bookings.length,
        bookingHistory: bookings || []
      };
    }));

    res.render('admin-drivers', { drivers: driverData });
  } catch (err) {
    console.error(err);
    res.send("Error fetching drivers");
  }
});

// Approve a driver
router.post('/admin/drivers/:id/approve', adminAuth, async (req, res) => {
  try {
    await Driver.findByIdAndUpdate(req.params.id, { approvalStatus: 'APPROVED' });
    res.redirect('/admin/drivers');
  } catch (err) {
    console.error(err);
    res.send("Error approving driver");
  }
});

// Reject a driver
router.post('/admin/drivers/:id/reject', adminAuth, async (req, res) => {
  try {
    await Driver.findByIdAndUpdate(req.params.id, { approvalStatus: 'REJECTED' });
    res.redirect('/admin/drivers');
  } catch (err) {
    console.error(err);
    res.send("Error rejecting driver");
  }
});

module.exports = router