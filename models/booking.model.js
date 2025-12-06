const mongoose =require('mongoose')

const bookingSchema = new mongoose.Schema({
    customerName:String,
    destination:String,
    contact:Number,
    startDate:Date,
    endDate:Date,
    carId:String,
    totalCost:Number
})
module.exports=mongoose.model('Booking',bookingSchema);  