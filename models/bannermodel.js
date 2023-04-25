const { default: mongoose, model } = require("mongoose")

const bannerSchema=new mongoose.Schema({
    heading:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    isFeatured:{
          type:Boolean,
          default:true
    },
    bannerType:{
        type:String,
        default:""
    }

})

module.exports=mongoose.model("banner",bannerSchema)