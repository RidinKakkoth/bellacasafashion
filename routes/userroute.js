const express=require("express")
const userRoute=express()
const productController=require("../controllers/productcontroller")
const categoryController=require("../controllers/categorycontroller")
const cartController=require("../controllers/cartcontroller")
const wishlistController=require("../controllers/wishlistcontroller")
const profileController=require("../controllers/profilecontroller")
const orderController=require("../controllers/ordercontroller")
const couponController=require("../controllers/couponcontroller")


const auth=require("../middleware/auth")
userRoute.set("views","./views/user")



const userController=require("../controllers/usercontroller")

userRoute.get("/", userController.userHome)

userRoute.get("/home",auth.isSignin, userController.userHome)

userRoute.get("/signin",auth.isSignout,userController.loadSignIn)

userRoute.post("/signin",userController.userSignIn)

userRoute.get("/signup",auth.isSignout,userController.loadSignUp)

userRoute.post("/signup",userController.registerUser)

userRoute.get("/userprofile",auth.isSignin,userController.userProfile)

userRoute.put("/changeUserProfile",auth.isSignin,profileController.changeUserProfile)

userRoute.get("/forgotpassword",userController.forgotPassword)

userRoute.post("/forgotpassword",userController.submitForgotPassword)

userRoute.put("/changepassword",auth.isSignin,userController.changePassword)

userRoute.get("/verify",userController.verifyMail)

userRoute.post("/newpassword",userController.newPassword)

userRoute.get("/shop",auth.isSignin,userController.userShop)

userRoute.post("/cart",auth.isSignin,cartController.addToCart)

userRoute.get("/loadcart",auth.isSignin,cartController.loadCart)

userRoute.delete("/deleteCartProduct/:prodId",auth.isSignin,cartController.deleteCartProduct)

userRoute.post("/updateQuantity",auth.isSignin,cartController.updateQuantity)

userRoute.get("/otp",userController.otpPage)

userRoute.get("/resendotp",userController.otpPage)

userRoute.post("/otpsubmit",userController.otpSubmit)

userRoute.post("/wishlist",auth.isSignin,wishlistController.addToWishlist)

userRoute.get("/loadwishlist",auth.isSignin,wishlistController.loadWishlist)

userRoute.delete("/wishlist/:prodId",auth.isSignin,wishlistController.deleteWishlistProduct)

userRoute.get("/loadcheckout",auth.isSignin,cartController.loadCheckout)

// userRoute.get("/filtercategory/:id",auth.isSignin, userController.filterCategory);

userRoute.get("/productview/:id",auth.isSignin,userController.productView)

userRoute.get("/addnewaddress",auth.isSignin,profileController.loadAddAddress)

userRoute.post("/addnewaddress",auth.isSignin,profileController.addAddress)

userRoute.get("/deleteaddress/:index",auth.isSignin,profileController.deleteAddress)

// userRoute.get("/selectaddress",auth.isSignin,profileController.selectAddress)

userRoute.post("/selectone",auth.isSignin,profileController.selectOneAddress)

userRoute.post("/placeorder",auth.isSignin,orderController.placeorder)

userRoute.post("/cancelorder",auth.isSignin,orderController.cancelOrder)

userRoute.get("/renderconfirmation",auth.isSignin,orderController.confirmation)

userRoute.post("/initiaterazorpay",auth.isSignin,orderController.initiatePay)

userRoute.post("/verifyRazorpay",auth.isSignin,orderController.verifyPayment)

userRoute.get("/myorder",auth.isSignin,orderController.orderHistory)

userRoute.get("/vieworderitems/:id",auth.isSignin,orderController.viewOrderData)

userRoute.post("/applycoupon",auth.isSignin,couponController.applyCoupon)

userRoute.get("/contactus",userController.contactUs)

userRoute.get("/signout",userController.signOut)


module.exports=userRoute