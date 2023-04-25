const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
        
    },
    address:{
        type:Array,
        required:true
    }
    // address:[{
    //     name: {
    //         type: String,
    //         required:true
     
    //     },
    //     email:{
    //         type:String,
    //         required:true
    //     },
        
    //     phone: {
    //         type: Number,
    //         required:true
    
    //     },
    //     pincode: {
    //         type: String,
    //         required:true
    
    //     },
        
    //     house: {
    //         type: String,
    //         required:true
    
    //     },
    //     city: {
    //         type: String,
    //         required:true
    
    //     },
    //     state: {
    //         type: String,
    //         required:true
           
    //     },
    //       landmark: {
    //         type: String,
    //     }
    // }

    // ]
   
  });
  
  const address = mongoose.model("address", addressSchema);
  
  module.exports = address;
  