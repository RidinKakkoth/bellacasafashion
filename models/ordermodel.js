const { default: mongoose } = require("mongoose");

const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    products: [
        {
         productId: {
         type: mongoose.Schema.Types.ObjectId,
         ref:'product'
         },
        quantity: {
            type: Number, 
            
             },
             totalPrice: {
                 type: Number,
                 default:0
            }
       
         }
        
 ],
    address:{
        type:Array,
        required:true
    },
    discount:{
        type:Number,
        default:0
    },
    discountedTotal:{
       type:Number,
       default:0
    },
    totalAmount:{
        type:Number,
        required:true
    },
    paymentType:{
        type:String
    },
    paymentStatus:{
        type:String,
        default:"pending"
    },
    orderId: {
        type: String,
        
    }, 
    orderStatus:{
        type:String,
        default:"ordered"
    }
},{timestamps:true})


module.exports=mongoose.model("order",orderSchema)