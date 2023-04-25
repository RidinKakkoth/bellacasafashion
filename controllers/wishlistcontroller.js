const user = require("../models/usermodel");
const category = require("../models/categorymodel");
const cart = require("../models/cartmodel");
const product = require("../models/productmodel");
const wishlist=require("../models/wishlistmodel")
const { default: mongoose } = require("mongoose");

const loadWishlist=async(req,res)=>{
    try{
        const usersId=req.session.user_id;
        userName = req.session.user_Name;


      const  wishlistdata=await wishlist.findOne({userId:usersId}).populate("products.productId").lean()
        if(wishlistdata){

            if(wishlistdata.products[0]){

                const stocks=await Promise.all(wishlistdata.products.map(async(i)=>{
                    return stock=await product.findOne({_id:i.productId._id}).lean()
                }))
                 res.render("wishlist",{user:true,stocks,userName})

            }
            else{
                res.render("emptywishlist",{user:true,userName})
            }

        }
        else{
            res.render("emptywishlist",{user:true,userName})
        }
        
    }
    catch(error){
        console.log(error.message);
        res.render("error500")
    }
}

const addToWishlist=async(req,res)=>{
    try{
          const productId= req.body.product
        
          const usersId= req.session.user_id;

          let isWishlist=await wishlist.findOne({userId:usersId}).lean()

          if(isWishlist){
            let productExists=await wishlist.findOne({userId:usersId,"products.productId":productId})

            if(productExists){
                 await wishlist.updateOne({userId:usersId},{$pull:{products:{productId:productId}}})
                return res.json({ message: "success" });

            }
            else{
               await wishlist.findOneAndUpdate({userId:usersId},{$addToSet:{products:{productId:productId}}})
                return res.json({ message: "success" });

            }
          }
          else{
        await wishlist.create({userId:usersId,products:{productId:productId}})
          }

    return res.json({ message: "success" });

    }
    catch(error){
        console.log(error);
        res.render("error500")

    }
}

const deleteWishlistProduct= async(req,res)=>{

    try{
        const usersId= req.session.user_id;
        const productId= req.params.prodId
        console.log(productId);
      

        await wishlist.updateOne({userId:usersId},{$pull:{products:{productId:productId}}})
        res.json({message:"removed"})

    }
    catch(error){
        console.log(error);
        res.render("error500")
    }

}

module.exports={loadWishlist,addToWishlist,deleteWishlistProduct}