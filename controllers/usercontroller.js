const user = require("../models/usermodel");
const product = require("../models/productmodel");
const category = require("../models/categorymodel");
const cart=require("../models/cartmodel")
const banner=require("../models/bannermodel")
const cartfunctions = require('../controllers/cartfunctions');
const address = require("../models/addressmodel");




const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


var userName;
 var cartNumber;



//---------------------------------------------------load user signin page----------------------------

const loadSignIn = async (req, res) => {
  try {
    res.render("signin");
  } catch (err) {
    console.log(err.message);
  }
};

//-----------------------------------------------------post user signin--------------------------------

const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCred = await user.findOne({ email: email });
    //verified
    if (userCred && !userCred.isBlocked) {
      const status = await bcrypt.compare(password, userCred.password);

      if (status) {
        req.session.user_id = userCred._id;
        req.session.user_Name = userCred.name;
        userName = req.session.user_Name;
              //  console.log(req.session.user_id);
        
        

        // res.render("userhome", { user: true, userName });
        res.redirect("/home")
        
      }
      else { 
        res.render("signin", {
          failmessage: "invalid credentials",
        });
      }
    } else { 
      res.render("signin", {
        failmessage: "invalid credentials ",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

//--------------------------------------------------------user signup page load--------------------

const loadSignUp = async (req, res) => {
  try {
    // const message = req.flash('success');
    res.render("signup");
  } catch (err) {
    console.log(err.message);
  }
};

//------------------------send verify mail for forgot password--------------------------

const sendVerificationMail = async ( email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const mailOptions = {
      from: "brocampproject@gmail.com",
      to: email,
      subject: "For Password Reset",
      html:'<p> hii  '+', please click here to <a href=" http://localhost:3000/verify?id='+email+'"> Reset </a> your password.</p>'

    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("email has been sent", info.response);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

//----------------------------------------------verifyMail------------------------------

const verifyMail = async (req, res) => {
  try {
      const email=req.query.id
     res.render("enterpassword",{email})

  } catch (err) {
    console.log(err.message);
  }
};
//----------------------------------------------forgotPassword------------------------------

const forgotPassword=async(req,res)=>{
  try {

    res.render("entermail")
    
       
    // sendVerificationMail(name, email, userData._id);
    
  } catch (error) {
    console.log(error.message);
  }
}

//--------------------------------submit email for ForgotPassword ----------------------------
const submitForgotPassword=async(req,res)=>{
try {

  const email=req.body.email
  const userExist=await user.findOne({email:email}).lean()
  if(userExist){

    sendVerificationMail(userExist.email)
    res.render("entermail",{failmessage:"check your email to reset password"})
  }
  else{
    res.render("entermail",{failmessage:"invalid email"})

  }
} catch (error) {
  console.log(error.message);
  
}
}
//--------------------------------newPassword----------------------------

const newPassword=async(req,res)=>{
  try {
    const email=req.body.email
    const newPassword=req.body.password
   const newPasswordHash= await bcrypt.hash(newPassword, 10);
        const updateInfo = await user.updateOne(
      { email:email},
      { $set: { password: newPasswordHash } }
    );
    // if(updateInfo){
    //       console.log(updateInfo);
    //   // req.session.user_id=updateInfo.us
    // }
    res.redirect("/signin")

  } catch (error) {
    console.log(error.message);
  }
}
//--------------------------------signup----------------------------

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;
//     const userExists = await user.findOne({ email: email });
//     const hashPassword = await bcrypt.hash(password, 10);

//     if (userExists) {
//       res.render("signup", { failmessage: "user already exist!!" });
//       return;
//     }

//     const newUser = new user({
//       name,
//       email,
//       phone,
//       password: hashPassword,
//     });
//     const userData = await newUser.save();

//     if (userData) {
//       //send verification email

//       sendVerificationMail(name, email, userData._id);

//       // req.flash('success', 'Signup successful');
//       res.render("signup", {
//         message: "successfully registered!! Please Login",
//       });
//     } else {
//       res.render("signup", { failmessage: "registration failed" });
//     }
//   } catch (err) {
//     console.log(err.message);
//   }
// };


// const verifyMail = async (req, res) => {
//   try {
//     const updateInfo = await user.updateOne(
//       { _id: req.query.id },
//       { $set: { isVerified: 1 } }
//     );
//     console.log(updateInfo);
//     res.redirect("/signin");
//   } catch (err) {
//     console.log(err.message);
//   }
// };

//---------------------------------------------------------------------------------------
var newUser;

const registerUser = async (req, res) => {
  try {
     const { name, email, phone, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

     newUser = new user({
      name,
      email,
      phone,
      password: hashPassword,
    });
    const userExists = await user.findOne({ email: email });
    // const userEmail=newUser.email

    if (userExists) {
      res.render("signup", { failmessage: "user already exist!!" });
      return;
    }
    else{
      await otpcheck(newUser)
      res.render("otp")
    }

  } catch (err) {
    console.log(err.message);
  }
};


var OtpCode;
const otpcheck = async function (req, res, next) {

  OtpCode = Math.floor(100000 + Math.random() * 988800)
  otp = OtpCode
  otpEmail = newUser.email
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "brocampproject@gmail.com",
      pass: "pksaxleyuczbmzag",
    }
  })

  let docs = {
    from: "brocampproject@gmail.com",
    to: otpEmail,
    subject: "BellaCasa verification",
    // text: OtpCode + " BellaCasa verification code, Do not share with others"
    html:`<p style="font-size:24px;font-weight:bold;">${OtpCode}</p><p> BellaCasa OTP verification code, Do not share with others</p>`
  
  }
  mailTransporter.sendMail(docs, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

const otpSubmit = async function (req, res, next) {
  const check = req.body.otp;
  const join = check.join('')
  if (OtpCode == join) {

    await user.insertMany([newUser])
  
    userCred=await user.findOne({email: newUser.email});
    req.session.user_id = userCred._id;
    req.session.user_Name = userCred.name;
 
    userName = req.session.user_Name;
    res.redirect('/home')
  }
  else {
  
    res.redirect('/otp')
  }
}

/// OTP Get page --------------------------------------------------- 


const otpPage = function (req, res, next) {

  res.render('otp',);
  
}

// RESEND otp -------------------------------------------

const resendotp = async function (req, res, next) {
  await otpcheck();
  res.redirect('/otp')
}

//----------------------------------------------user profile------------------------------

const userProfile=async(req,res)=>{
  try{

    const userData=await user.findOne({_id: req.session.user_id})
    console.log(userData);
   
    
          res.render("userprofile",{user:true,userName,userData,cartNumber})
  }
  catch(error){
    console.log(error);
  }
}

//----------------------------------------------password change---------------------------------

const changePassword=async(req,res)=>{
  try {

  

    const userId=req.session.user_id;
    const {currentpassword,newpassword,confirmnewpassword}=req.body
    if(newpassword==confirmnewpassword){

      const userData=await user.findById({_id:userId}).lean()
      const oldHashPassword=userData.password

  
      const status = await bcrypt.compare(currentpassword, oldHashPassword);
      if(status){
        const newHashPassword=await bcrypt.hash(newpassword, 10);
        await user.findByIdAndUpdate({_id:userId},{$set:{password:newHashPassword}})
        
        return res.json({message:"password changed successfully"})
      }
      else{
        return res.json({message:"current password entered is wrong"})
        
      }
    }
    else{
      return res.json({message:"new passwords doesn't match"})
    }

  } catch (error) {

    console.log(error.message);
    
  }
}

//----------------------------------------------home&shop---------------------------------


const userHome = async (req, res) => {
  try {
    
    const productsData = await product.find({isListed:true}).limit(12);
    const bigBannerData= await banner.find({isFeatured:true,bannerType:"big"}).limit(2)
    const smalllBannerData= await banner.find({isFeatured:true,bannerType:"small"}).limit(3)
  
    const userId=req.session.user_id;
    cartData = await cart
      .findOne({ userId: userId })
      .populate("products.productId")
      .lean();
     if(cartData){

       req.session.cartNumber=cartData.products.length
     }
     if(req.session.user_id){

       cartNumber=req.session.cartNumber
       userName= req.session.user_Name
     }
     else
{
  cartNumber=null
  userName=null
}     
    res.render("userhome", { user: true,cartNumber, productsData,userName,bigBannerData,smalllBannerData});
   
  } catch (err) {
    console.log(err.message);
    res.render("error500")
  }
};

const userShop = async (req, res) => {
  try {

    // const userId=req.session.user_id;
    const categoryList=await category.find({isListed:true})
    const filteredProducts  = await product.find({ isListed: true })
  .populate({
    path: 'category',
    match: { isListed:true }
  })
  .lean();
   
  // const  productsData = filteredProducts.filter(product => product.category !== null);
  
  
  var page=1;
  if(req.query.page){
    page=req.query.page
  }
  const limit=12;
  
var search = req.query.search || ''; // Get the search value from req.query or set to empty string if not present
var categoryId = req.query.categoryId; // Get the categoryId value from req.query
var minPrice = req.query.minPrice || 0; // Get the minPrice value from req.query or set to 0 if not present
var maxPrice = req.query.maxPrice || Number.MAX_VALUE // Get the maxPrice value from req.query or set to a high value if not present
var sortValue= req.query.sortValue||1
  
  // var search='';
  //  if(req.query.search){
  //   search=req.query.search
  //  }
    var minPrice = 0; // Minimum price
    var maxPrice = Number.MAX_VALUE; // Maximum price
    if (req.query.minPrice) {
      minPrice = req.query.minPrice;
    }
    if (req.query.maxPrice) {
      maxPrice = req.query.maxPrice;
    }
    var sortValue=1;
    if (req.query.sortValue) {
      sortValue = req.query.sortValue;
    }
    
  
    // var categoryId=req.query.categoryId

    const query = {
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { description: { $regex: '.*' + search + '.*', $options: 'i' } }
      ],
      price: { $gte: minPrice, $lte: maxPrice }
    };
    
    if (categoryId) {
      query.category = categoryId;
    }
    
    const productsData = await product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ price: sortValue })
      .exec();


//-------------------------------------------old------------------------------
  //    if(req.query.categoryId){
  //     categoryId=req.query.categoryId
  //    }
  //  const productsData = await product.find({
  //   $or: [
  //     { name: { $regex: '.*' + search + '.*', $options: 'i' } },
  //     { description: { $regex: '.*' + search + '.*', $options: 'i' } }
  //   ],category:categoryId,
  //   price: { $gte: minPrice, $lte: maxPrice }
  // }).limit(limit*1).skip((page-1)*limit ).sort({price:sortValue}).exec();

  // const count = await product.find({
  //   $or: [
  //     { name: { $regex: '.*' + search + '.*', $options: 'i' } },
  //     { description: { $regex: '.*' + search + '.*', $options: 'i' } }
  //   ],
  //   price: { $gte: minPrice, $lte: maxPrice }
  // }).countDocuments()
  //-----------------------------------------------old end--------------------------------------
  const count = await product.find(query).countDocuments()


   totalPages=Math.ceil(count/limit) 
  
  
  currentPage=page
  nextPage=currentPage+1
  previousPage=currentPage-1

  //cart number

//   cartData = await cart
//   .findOne({ userId: userId })
//   .populate("products.productId")
//   .lean();
//  if(cartData){

//    req.session.cartNumber=cartData.products.length
//  }
 
  cartNumber=req.session.cartNumber
 

    res.render("shop", { user: true,totalPages,currentPage,nextPage,previousPage,categoryId,minPrice,maxPrice,sortValue, cartNumber,userName,productsData,categoryList});
  } catch (err) {
    console.log(err.message);
    res.render("error500")
  }
};

const productView = async (req, res) => {
  try {
    console.log(req.params.id);
    const productsData=await product.find({_id:req.params.id}).populate("category").lean()
    res.render("productview", { user:true,cartNumber,productsData,userName, });
  } catch (err) {
    console.log(err.message);
    res.render("error500")
  }
};

//show products only in that category
// const filterCategory=async(req,res)=>{
//   try{
//        const categoryList=await category.find({isListed:true})
//        const productsData=await product.find({category:req.params.id,isListed:true})
       
       
//        if(productsData){
//         res.render("shop",{user:true,productsData,userName,categoryList})
//        }
       
//   }
//   catch(error){
//     console.log(error.message);
//   }
// }


//----------------------------------------------contact us---------------------------------
const contactUs=async(req,res)=>{
  try {
    console.log(userName);
    res.render("contactus",{user:true,userName,cartNumber})
    
  } catch (error) {
    console.log(error.message);
    res.render("error500")
    
  }
}
//----------------------------------------------signout---------------------------------

const signOut = async (req, res) => {
  try {
    req.session.user_id=null
    req.session.cartNumber=null
    cartNumber=null
    userName=null
    res.redirect("/signin");
  } catch (error) {
    console.log(error.message);
    res.render("error500")
  }
};


module.exports = {
  loadSignIn,
  userSignIn,
  loadSignUp,
  registerUser,
  changePassword,
  userHome,
  userShop,
  otpSubmit,
  forgotPassword,
  submitForgotPassword,
  sendVerificationMail,
  verifyMail,
  newPassword,
  otpPage,
  signOut,
  // filterCategory,
  productView,
  userProfile,
  resendotp,
  contactUs
};
