const cart = require("../models/cartmodel");
const order=require("../models/ordermodel")
const user = require("../models/usermodel")
const product=require("../models/productmodel");
const Razorpay=require("../controllers/razorpaycontroller")
const coupon=require("../models/couponmodel")
const { promises } = require("nodemailer/lib/xoauth2");

//---------------------------------------place order -------------------------------------

const placeorder=async(req,res)=>{
    try{
        const userId=req.session.user_id;
        totalCartValue=await req.session.totalCartValue //totalCart value is added to session
        requiredCartData=await req.session.requiredCartData
        const{name,phone,email,house,city,state,pincode,landmark,paymentmethod}=req.body
        
        const cartData=await cart.findOne({userId:userId}).lean()


        req.body.userId=userId;
        req.body.totalAmount=totalCartValue;
        req.body.discount=req.session.discountAmount
        req.body.discountedTotal=req.session.discountedTotal
        
        req.body.products=cartData.products;
        req.body.address={
            name,phone,email,house,city,state,pincode,landmark
        }
        req.body.paymentType=paymentmethod;
        orderData = await order.create(req.body)
        
        Promise.all(cartData.products.map(({productId,quantity}) => {
            return product.findOneAndUpdate({_id:productId},{$inc:{stock:-quantity}})
          }))
          
          deleteCart=await cart.findOneAndDelete({userId:userId})
          req.session.cartNumber=0;
          const couponCode=req.session.couponCode
        
          await coupon.findOneAndUpdate({couponCode:couponCode},{users:{userId:userId,couponStatus:"invalid"}})
          await coupon.findOneAndUpdate({couponCode:couponCode},{$inc:{couponLimit:-1}})
        
        const confirmationData=await order.findOne({_id:orderData._id}).populate("products.productId").lean()
        req.session.confirmationData=confirmationData

        return res.json("success")
    }
    catch(error){
        console.log(error.message);
        res.render("error500")
    }
}
//initiate online payment--------------------------------------

const initiatePay=async(req,res)=>{
    try {
        
        const userId=req.session.user_id

        totalCartValue=await req.session.totalCartValue //totalCart value is added to session
        // requiredCartData=await req.session.requiredCartData
        const{name,phone,email,house,city,state,pincode,landmark,paymentmethod}=req.body
       
        
        const cartData=await cart.findOne({userId:userId}).lean()

        discountedTotal=req.session.discountedTotal
        req.body.userId=userId;
        req.body.totalAmount=totalCartValue;
        req.body.discount=req.session.discountAmount
        req.body.discountedTotal=discountedTotal
        req.body.products=cartData.products;
        req.body.address={
            name,phone,email,house,city,state,pincode,landmark
        }
        req.body.paymentType=paymentmethod;
        orderData = await order.create(req.body)

        const couponCode=req.session.couponCode
        
         await coupon.findOneAndUpdate({couponCode:couponCode},{users:{userId:userId,couponStatus:"invalid"}})
         await coupon.findOneAndUpdate({couponCode:couponCode},{$inc:{couponLimit:-1}})


        razorData=await Razorpay.initiateRazorpay(orderData._id,discountedTotal)

        const x=await order.findOneAndUpdate({_id:orderData._id},{orderId:razorData.id})


        const confirmationData=await order.findOne({_id:orderData._id}).populate("products.productId").lean()
        req.session.confirmationData=confirmationData

        res.json({message:'success',totalCartValue,razorData,orderData})
        
    } catch (error) {
        console.log(error.message);
        res.render("error500")
    }
}
//-------------------------------------verify payment-------------------------------------------------------

const verifyPayment=async(req,res)=>{
    try {
       userId=req.session.user_id
   
        success=await Razorpay.validate(req.body)
       
        orderId=req.body.razorData.id

        if(success){
            cartData=await order.findOneAndUpdate({orderId:orderId},{paymentStatus:"success"}).lean()

            // console.log(cartData);

            Promise.all(cartData.products.map(({productId,quantity}) => {
                return product.findOneAndUpdate({_id:productId},{$inc:{stock:-quantity}})
              }))

              deleteCart=await cart.findOneAndDelete({userId:userId})
              req.session.cartNumber=0;
        
        const confirmationData=await order.findOne({_id:orderData._id}).populate("products.productId").lean()
        req.session.confirmationData=confirmationData
        
        res.json({message:"success"})
        }

      
        
    } catch (error) {
        console.log(error.message);
        res.render("error500")
    }
}
//-------------------------------------render confirmation of order succcessfull-----------------------------

const confirmation=async(req,res)=>{
    try{
        userName=req.session.user_Name;
        const confirmationData=req.session.confirmationData
        const orderData=confirmationData.products.map(({productId,totalPrice,quantity})=>({
            name:productId.name,
            image:productId.image,
            totalPrice,
            quantity
        }))
        discountedTotal=req.session.discountedTotal
        discountAmount=req.session.discountAmount
        


        const orderDate = confirmationData.createdAt.slice(0, 10);
          res.render("orderconfirmation",{user:true,orderDate,userName,orderData,confirmationData,discountedTotal,discountAmount})
    }
    catch(error){
        console.log(error.message);
        res.render("error500")
    }
}

//-------------------------------my order of user----------------------------------------------

const orderHistory=async(req,res)=>{
    try{
       userName=req.session.user_Name

   const userId = req.session.user_id;
    const orderHistoryData = await order.find({ userId: userId }).populate("products.productId").populate("address").lean();

    const orderData = orderHistoryData.map((i) => {
      return i.products.map(({ productId, totalPrice, quantity }) => ({
        name: productId.name,
        image: productId.image,
        totalPrice,
        quantity,
      }));
    }).flat();//

    const addressData= orderHistoryData.map((i)=>{
       return i.address
    })
    
    // const orderDate = orderHistoryData.createdAt.slice(0, 10);
   
        res.render("orderhistory",{user:true,userName,orderData,orderHistoryData,addressData})
    }
    catch(error){
        console.log(error.message);
        res.render("error500")
    }
}

//------------------------------userside---------view user order product view----------------

const viewOrderData= async(req,res)=>{
 
    try{
        
        const userId=req.session.user_id
        const userName=req.session.user_Name

          const orderId=req.params.id
        const orderHistoryData=await order.findOne({_id:orderId}).populate("products.productId").populate("address").lean()

        const orderData= await orderHistoryData.products.map(({productId,quantity,totalPrice})=>({
            name:productId.name,
            quantity,
            totalPrice,
            image:productId.image
        }))
        
          
          res.render("vieworderdata",{user:true,userName,orderData,orderHistoryData})


    }
    catch(error){
          console.log(error);
          res.render("error500")
    }}

    //----------------------------------------admin ---side order management---------------------------------------


    const orderManagement=async(req,res)=>{
        try{
            userName=req.session.user_Name

             const orderHistoryData = await order.find().populate("products.productId").populate("address").lean();
         
             const orderData = orderHistoryData.map((i) => {
               return i.products.map(({ productId, totalPrice, quantity }) => ({
                 name: productId.name,
                 image: productId.image,
                 totalPrice,
                 quantity,
               }));
             }).flat();
         
             const addressData= orderHistoryData.map((i)=>{
                return i.address
             })
             
          
               
            res.render("ordermanagement",{admin:true,orderData,orderHistoryData,addressData})
        }
        catch(error){
            console.log(error.message);
        }
    }

    //-----------------------------------------for admin -- view products that ordered form order history----------

    const viewUserOrders= async(req,res)=>{
 
        try{
            
    
              const orderId=req.params.id
            const orderHistoryData=await order.findOne({_id:orderId}).populate("products.productId").populate("address").lean()
    
            const orderData= await orderHistoryData.products.map(({productId,quantity,totalPrice})=>({
                name:productId.name,
                quantity,
                totalPrice,
                image:productId.image
            }))
            
              
              res.render("viewuserorderdata",{admin:true,orderData,orderHistoryData})
    
    
        }
        catch(error){
              console.log(error);
        }}

        //--------------------------------user cancel order------------------------

        const cancelOrder=async(req,res)=>{

         try
         {
            const orderId=req.body.orderId
            const userId=req.session.user_id
          

            const orderData = await order.findOne({ _id:orderId }).populate("products.productId").lean();
          
             Promise.all(orderData.products.map(({productId,quantity}) => {
                 return product.findOneAndUpdate({_id:productId},{$inc:{stock:quantity}})
              }))
            
              const status= await order.findOneAndUpdate({_id:orderId},{$set:{orderStatus:"cancelled"}})
              const refund=orderData.discountedTotal

              if(orderData.paymentType=="online"){
                       await user.findByIdAndUpdate({_id:userId},{$inc:{wallet:refund}})
              }

         
              res.json({ message: 'successfull' });

         }
         catch(error){
            console.log(error.message);
         }

        }

             //--------------------------------dispatch order------------------------

             const dispatchOrder=async(req,res)=>{

                try
                {
                   const orderId=req.body.orderId
         
                     const status= await order.findOneAndUpdate({_id:orderId},{$set:{orderStatus:"dispatched"}})
                
                     res.json({ message: 'successfull' });
       
                }
                catch(error){
                   console.log(error.message);
                }
       
               }
             //--------------------------------deliver order------------------------

             const deliverOrder=async(req,res)=>{

                try
                {
                   const orderId=req.body.orderId
         
                     const status= await order.findOneAndUpdate({_id:orderId},{$set:{orderStatus:"delivered",paymentStatus:"success"}})
                
                     res.json({ message: 'successfull' });
       
                }
                catch(error){
                   console.log(error.message);
                }
       
               }

module.exports={placeorder,cancelOrder,dispatchOrder,deliverOrder,orderHistory,confirmation,initiatePay,verifyPayment,viewOrderData,viewUserOrders,orderManagement}