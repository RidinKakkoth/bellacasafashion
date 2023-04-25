const address = require("../models/addressmodel");
const user = require("../models/usermodel");
const mongoose=require("mongoose")
const coupon=require("../models/couponmodel")

// var userName = req.session.user_Name;

const loadAddAddress=async(req,res)=>{
    userName=req.session.user_Name
    try{
res.render("address",{user:true,userName})
    }
    catch(error){
        console.log(error.message);
        res.render("error500")
    }
}

const addAddress=async(req,res)=>{
    try{
        const userId=req.session.user_id
        // const{name,house,city,state,pincode,phone,landmark,email}=req.body

        const findUSer=await address.findOne({userId:userId})
        if(findUSer){

            // req.session.selectedAddress= await address.findOneAndUpdate({userId:userId},{$push:{address:req.body}})

            req.session.selectedAddress=await address.findOneAndUpdate(
                {userId:userId}, // specify the document you want to update
                { $push: { address: { $each: [req.body], $slice: -4 } } }, // use $push with $each to add newObject, and $slice with -4 to keep only the last 4 elements
                { new: true })



        }
        else{
            req.session.selectedAddress= await address.create({
             userId:userId,
             address:req.body })
        }

res.redirect("/loadcheckout")
    }
    catch(error){
        console.log(error.message);
        res.render("error500")
    }
}

// const selectAddress=async(req,res)=>{
//     try{
//         const userId=req.session.user_id
//         userName = req.session.user_Name;

//         const addressData=await address.find({userId:userId}).lean()

//         // const findAddress=await address.findOne({userId:userId}).populate("address").lean()
//         // const addressData = findAddress.address.map(a => ({ name: a.name,email:a.email,phone:a.phone,pincode:a.pincode,house:a.house, city: a.city, state: a.state,landmark:a.landmark }));
      

// res.render("selectaddress",{user:true,addressData,userName,userId})
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }

const selectOneAddress=async (req,res)=>{
    try{
        const userId=req.session.user_id
        userName = req.session.user_Name;
        // const index=req.params.index
        const index=req.body.address;

        const findAddress=await address.findOne({userId:userId})
        const selectedAddress=findAddress.address[index]
        
        totalCartValue=req.session.totalCartValue
        requiredCartData= req.session.requiredCartData
        req.session.selectedAddress=selectedAddress
        discountAmount=req.session.discountAmount
        discountedTotal=req.session.discountedTotal
        const addressData=await address.find({userId:userId}).lean()

      //find coupon code to show

      const couponCode=await coupon.find({expiryDate:{$gt:Date.now()}}).limit(1).lean()
        // res.redirect("/loadcheckout")
         res.render("checkout",{user:true,selectedAddress,addressData,couponCode,userName,requiredCartData,discountAmount,discountedTotal,totalCartValue})

    }
    catch(error){
        console.log(error.message);
        res.render("error500")
    }
}


const changeUserProfile=async(req,res)=>{
    try {
        
        const userId=req.session.user_id;

        const {name,phone,house,city,state,pincode}=req.body
        const updateUserData=await user.findOneAndUpdate({_id:userId},{$set:{name:name,phone:phone,house:house,city:city,state:state,pincode:pincode}})
        return res.json({message:"profile updated successfully"})

    } catch (error) {
        console.log(error.message);
        res.render("error500")    
    }
}


const deleteAddress=async (req,res)=>{
    try{
        const userId=req.session.user_id
        console.log(userId);
        userName = req.session.user_Name;
        const index=req.params.index;
        console.log(index);

        // const findAddress=await address.updateOne({userId:userId},{$pull:{address:{ $at: index }}})

          
          console.log(updatedAddress); // Updated document with the latest state
          
          
          
          
          

          

          console.log(addr);

    //    const selectedAddress=findAddress.address[index]
        
    //     totalCartValue=req.session.totalCartValue
    //     requiredCartData= req.session.requiredCartData
    //     req.session.selectedAddress=selectedAddress
    //     discountAmount=req.session.discountAmount
    //     discountedTotal=req.session.discountedTotal
    //     const addressData=await address.find({userId:userId}).lean()

    //   //find coupon code to show

    //   const couponCode=await coupon.find({expiryDate:{$gt:Date.now()}}).limit(1).lean()
    //     // res.redirect("/loadcheckout")
    //      res.render("checkout",{user:true,selectedAddress,addressData,couponCode,userName,requiredCartData,discountAmount,discountedTotal,totalCartValue})
// res.json({message:"deleted"})

    }
    catch(error){
        console.log(error.message);
    }
}




module.exports={loadAddAddress,selectOneAddress,addAddress,
    deleteAddress,changeUserProfile
}