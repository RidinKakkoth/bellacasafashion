// // const admin = require("../models/adminmodel");
// const user=require("../models/usermodel")

// const checkBlock=async(req,res,next)=>{
   
//     const userCred=await user.findOne({email:req.body.email})
//     console.log(userCred);
//     if(userCred&&userCred.isBlocked){
        
//      res.render("signin",{failmessage:"you are blocked"})
//     }
//     next()
// }


// module.exports={checkBlock}