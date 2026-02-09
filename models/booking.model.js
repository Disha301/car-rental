const mongoose =require('mongoose')

const bookingSchema = new mongoose.Schema({
    customerName:String,
    destination:String,
    contact:Number,
    startDate:Date,
    endDate:Date,
    days:Number,
    carId:String,
    totalCost:Number,
    
    paymentStatus : {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING'
    
  },
  createdAt:{
        type:Date,
        default:Date.now,
        },
  //carId: {
   // type: mongoose.Schema.Types.ObjectId,
   // ref: "car"          // 👈 link to Car model
  //},
  
  driverId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Driver',
  required: false
},

user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},

  receiptId: String,
  userEmail: String
});


module.exports=mongoose.model('Booking',bookingSchema);  