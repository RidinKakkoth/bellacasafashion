const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    house:{
      type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    pincode:{
        type:Number
    },
    wallet:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Number,
        default:0
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("user",userSchema)