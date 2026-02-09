const express =require('express');
const app =express();

//requiring mongoose to handle client data
const mongoose =require('mongoose')
mongoose.connect('mongodb://localhost:27017/car-rent');

const session =require('express-session');
app.set("view engine","ejs");

//to get resonse from user in readable format
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//to link static files like css and js 
app.use(express.static('public'))

app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: false
}));

const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const driverRoutes = require('./routes/driver.routes');

const User = require('./models/user.model');
const car = require('./models/car.model'); 
const booking = require('./models/booking.model'); 
const Driver = require('./models/driver.model');

app.use(paymentRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(driverRoutes);

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/form',(req,res)=>{
    res.render("form")
})

//available car list
const carList = {
    'CAR001':{
        name:'Sedan',rentPerDay: 90
    },
    'CAR002':{
        name:'SUV',rentPerDay: 120
    },
    'CAR003':{
        name:'HatchBack',rentPerDay: 50
    },
    'CAR004':{
        name:'Toyota Hilux',rentPerDay: 80
    },
    'CAR005':{
        name:'Hyndari',rentPerDay: 80
    }
};
    
 app.post('/form', async (req, res) => {
        const { customerName,destination,contact, carId ,startDate,endDate,driverId} = req.body;
        const car = carList[carId];
        let user = await User.findOne({ contact });

if (!user) {
  user = new User({ contact });
  await user.save();
}

// store user in session
req.session.userId = user._id;

    console.log(req.body);

        if (!car) {
            return res.send("Invalid car ID");
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Calculate number of days (including same-day booking as 1 day)
        const timeDiff = end - start;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    
        if (days <= 0) {
            return res.send("End date must be after start date.");
        }
    
        const totalCost = car.rentPerDay * days;
        
    
        const newbooking = new booking({
            customerName,
            destination,
            contact,
            carId,
            startDate,
            endDate,
            days,
            totalCost,
            if (driverId) {
  bookingData.driverId = driverId;
},
            user: req.session.userId
        });
    
       
          try {
        const savedBooking = await newbooking.save();

        // ✅ Attach booking to logged-in user (old functionality preserved)
        
    if (req.session.userId) {
      await User.findByIdAndUpdate(
        req.session.userId,
        { $push: { bookings: savedBooking._id } }
      );
    }
        // Mark driver unavailable
        if (driverId) await Driver.findByIdAndUpdate(driverId, { availabilityStatus: 'UNAVAILABLE' });

       const populatedBooking = await booking
  .findById(savedBooking._id)
  .populate('driverId');

res.render("response", {
  booking: populatedBooking,
  customerName,
  car: car.name,
  days,
  totalCost,
  driver: populatedBooking.driverId
});


    } catch (error) {
        console.error("BOOKING ERROR :",error);
        res.status(500).send("Internal server error");
    }
});
app.get('/about',(req,res)=>{
    res.render("about")
})

app.get('/contact',(req,res)=>{
    res.render("contact")
})


app.get('/payment-successful',(req,res)=>{
    res.render("paid")
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

;
/*app.get('/select-driver/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    // fetch booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.send("Booking not found");
    }

    // fetch only approved + available drivers
    const drivers = await Driver.find({
      approvalStatus: 'APPROVED',
      availabilityStatus: 'AVAILABLE'
    });

    res.render('select-driver', {
      drivers,
      booking
    });

  } catch (err) {
    console.error(err);
    res.send("Error loading drivers");
  }
});*/
