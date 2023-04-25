const express=require("express")
const adminRoute=express()
adminRoute.set("views","./views/admin")
const adminController=require("../controllers/admincontroller")
const productController=require("../controllers/productcontroller")
const categoryController=require("../controllers/categorycontroller")
const bannerController=require("../controllers/bannercontroller")
const orderController=require("../controllers/ordercontroller")
const couponController=require("../controllers/couponcontroller")
const multer=require("../middleware/multer")
// const block=require("../middleware/block")
const fs=require("fs")
const auth=require("../middleware/auth")




adminRoute.get("/admin",auth.isAdminSignout,adminController.loadSignIn)

adminRoute.post("/admin",adminController.adminSignIn)

adminRoute.get("/admindashboard",auth.isAdminSignin,adminController.loadDashboard)

adminRoute.get("/salesReport",auth.isAdminSignin,adminController.salesReport)

adminRoute.get("/downloadpdf",auth.isAdminSignin,adminController.downloadPdf)

adminRoute.get("/downloadexcel",auth.isAdminSignin,adminController.downloadExcel)


//------------------------------------------------------------------------

adminRoute.get("/usermanagement",auth.isAdminSignin,adminController.userManagement)

// adminRoute.get("/adduserdata",auth.isAdminSignin,adminController.loadAddUser)

// adminRoute.post("/adduserdata",adminController.addUser)

// adminRoute.get("/edituser/:id",auth.isAdminSignin,adminController.loadEditUser)

// adminRoute.post("/updateuser/:id",adminController.updateUserdata)

adminRoute.get("/blockuser/:id",auth.isAdminSignin,adminController.blockUser)

adminRoute.get("/unblockuser/:id",auth.isAdminSignin,adminController.unblockUser)

//-------------------------------------------------------------

adminRoute.get("/categorymanagement",auth.isAdminSignin,categoryController.loadCategory)

adminRoute.post("/addcategory",categoryController.addCategory)

// adminRoute.post("/deletecategory", categoryController.deleteCategory);

adminRoute.get("/listCategory/:id",auth.isAdminSignin,categoryController.listCategory)

adminRoute.get("/unlistCategory/:id",auth.isAdminSignin,categoryController.unlistCategory)

adminRoute.get("/editcategory/:id", categoryController.editCategory);

adminRoute.post("/updatecategory/:id", categoryController.updateCategory);


//------------------------------------------------------------------------

adminRoute.get("/viewproductlist",auth.isAdminSignin,productController.viewProductList)

adminRoute.get("/addproduct",auth.isAdminSignin,productController.loadAddProduct)

adminRoute.post("/addproduct",multer.array("image",4), productController.addProduct)

adminRoute.get("/listproduct/:id",auth.isAdminSignin,productController.listProduct) 

adminRoute.get("/unlistproduct/:id",auth.isAdminSignin,productController.unlistProduct)

adminRoute.get("/editproduct/:id",auth.isAdminSignin,productController.editProduct)

adminRoute.post("/updateproduct/:id",productController.updateProduct)

adminRoute.post("/updateimage/:id",multer.array("image",4),productController.updateImage)

//------------------------------------------------------------------------

adminRoute.get("/bannertable",auth.isAdminSignin,bannerController.bannerTable)

adminRoute.get("/addbanner",auth.isAdminSignin,bannerController.loadAddBanner)

adminRoute.post("/addbanner",multer.single("image"),bannerController.addBanner)

adminRoute.get("/editbanner/:id",auth.isAdminSignin,bannerController.editBanner)

adminRoute.post("/updatebanner/:id",auth.isAdminSignin,bannerController.updatebanner)

adminRoute.post("/updatebannerimage/:id",multer.single("image"),bannerController.updatebannerimage)

// adminRoute.delete("/deletebanner/:id",auth.isAdminSignin,bannerController.deleteBanner);

adminRoute.get("/featurebanner/:id",auth.isAdminSignin,bannerController.featureBanner) 

adminRoute.get("/unfeaturebanner/:id",auth.isAdminSignin,bannerController.unFeatureBanner)

//-------------------------------------------------------------------------------------------

adminRoute.get("/ordermanagement",auth.isAdminSignin,orderController.orderManagement)

adminRoute.post("/admincancelorder",auth.isAdminSignin,orderController.cancelOrder)

adminRoute.post("/dispatchorder",auth.isAdminSignin,orderController.dispatchOrder)

adminRoute.post("/deliverorder",auth.isAdminSignin,orderController.deliverOrder)

adminRoute.get("/viewuserorders/:id",auth.isAdminSignin,orderController.viewUserOrders)

//-----------------------------------------------------------------------------

adminRoute.get("/couponmanagement",auth.isAdminSignin,couponController.couponManage)

adminRoute.get("/addcoupon",auth.isAdminSignin,couponController.loadAddCoupon)

adminRoute.post("/addcoupon",auth.isAdminSignin,couponController.addCoupon)

adminRoute.delete("/deletecoupon/:id",auth.isAdminSignin,couponController.deleteCoupon)

adminRoute.get("/adminsignout",adminController.adminSignOut)

module.exports=adminRoute