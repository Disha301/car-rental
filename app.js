const express =require('express');
const app =express();

//requiring mongoose to handle client data
const mongoose =require('mongoose')
mongoose.connect('mongodb://localhost:27017/car-rent');

const car = require('./models/car.model'); 
const booking = require('./models/booking.model'); 

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

app.set("view engine","ejs");

//to get resonse from user in readable format
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//to link static files like css and js 
app.use(express.static('public'))


app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/form',(req,res)=>{
    res.render("form")
})

    
 app.post('/form', async (req, res) => {
        const { customerName,destination,contact, carId ,startDate,endDate} = req.body;
        const car = carList[carId];
    
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
            days,
            totalCost
        });
    
        
        try {
            await newbooking.save();
        } catch (error) {
            console.error("Error saving the booking:", error);
            return res.status(500).send("Internal server error");
        }
        
    
        res.render("response", { 
           
                 customerName,
                car:car.name ,
                days,
               totalCost
              });
              
            })
    
   

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