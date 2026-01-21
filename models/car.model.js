const mongoose =require('mongoose')

const carSchema = new mongoose.Schema({
    name:String,
    model:String,
    rentPerDay:Number,
    registrationNumber: 
{
    type:String,
    unique:true
}
})
module.exports=mongoose.model('Car',carSchema);