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
  //carId: {
   // type: mongoose.Schema.Types.ObjectId,
   // ref: "car"          // 👈 link to Car model
  //},
  paymentStatus:{
    type:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
  },
  receiptId: String,
  userEmail: String
});


module.exports=mongoose.model('Booking',bookingSchema);  