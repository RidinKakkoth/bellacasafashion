const coupon=require("../models/couponmodel")



const couponManage=async(req,res)=>{
    try{
        const couponData=await coupon.find().lean()
        
res.render("couponmanagement",{admin:true,couponData})
    }
    catch(error){
        console.log(error.message);
    }
}

const loadAddCoupon=async(req,res)=>{
    try{

        
             res.render("addcoupon",{admin:true})
    }
    catch(error){
        console.log(error.message);
    }
}

const addCoupon=async(req,res)=>{
    try {
        const couponCode=req.body.couponCode
        let couponExist=await coupon.exists({couponCode:couponCode})
        if(couponExist){
            res.render("addcoupon",{admin:true,message:"coupon already exists"})
        }
        else{
console.log("not");
            await coupon.create(req.body)
            res.redirect("/couponmanagement")
        }

        
    } catch (error) {
        console.log(error.message);
    }
}

const deleteCoupon=async(req,res)=>{
    try {
        const couponId=req.params.id
        console.log(couponId);
        await coupon.findOneAndDelete({_id:couponId})
        res.json({message:"success"})
    } catch (error) {
        console.log(error.message);
    }
}


const applyCoupon=async(req,res)=>{
    
    try{


    userId=req.session.user_id
    couponCode=req.body.couponCode
    totalCartValue=req.body.totalCartValue
    currentDate = new Date();

    
    
    const couponExists= await coupon.findOne({couponCode:couponCode}).lean()
    const isCouponUsed=await coupon.findOne({couponCode:couponCode,"users.userId":userId}).lean()
    

    if(couponExists &&couponExists.couponLimit>0){
        if(isCouponUsed){
           return res.json({message:"coupon already used"})
        }
        if(currentDate>couponExists.expiryDate){

            return res.json({message:"coupon expired"})
        }
        if(totalCartValue<couponExists.minAmount)
        {
            return res.json({message:"purchase amount is less"})
        }

        // await coupon.findOneAndUpdate({couponCode:couponCode},{users:{userId:userId,couponStatus:"invalid"}})
        // await coupon.findOneAndUpdate({couponCode:couponCode},{$inc:{couponLimit:-1}})

        // discountedTotal=totalCartValue-couponExists.discountAmount;
        // req.session.discountedTotal=discountedTotal

        req.session.discountAmount=couponExists.discountAmount
        req.session.discountedTotal=totalCartValue-couponExists.discountAmount;
        req.session.couponCode=couponExists.couponCode
         discountedTotal= req.session.discountedTotal
         discountAmount= req.session.discountAmount


        return res.json({message:"succes",discountedTotal,discountAmount})
    }
    return res.json({message:"coupon invalid"})
}
catch(error){
    console.log(error.message);
    res.render("error500")
}

}


module.exports={couponManage,deleteCoupon,loadAddCoupon,applyCoupon,addCoupon}