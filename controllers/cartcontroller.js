const user = require("../models/usermodel");
const category = require("../models/categorymodel");
const cart = require("../models/cartmodel");
const product = require("../models/productmodel");
const cartfunctions = require("../controllers/cartfunctions");
const address = require("../models/addressmodel");
const coupon=require("../models/couponmodel")

//loading product to cart

const loadCart = async (req, res) => {
  try {
    userName = req.session.user_Name;
    const usersId = req.session.user_id;

    cartData = await cart
      .findOne({ userId: usersId })
      .populate("products.productId")
      .lean(); //check cart is available or not for user
    if (cartData) {
      if (Array.isArray(cartData.products) && cartData.products.length > 0) {
        //check any product is in cart
        const { products } = cartData;
       

        const requiredCartData = products.map(
          ({ productId, quantity, totalPrice }) => ({
            prodId: productId._id,
            name: productId.name,
            stock:productId.stock,
            quantity,
            price: productId.price,
            totalPrice,
            image: productId.image,
          })
        );
        var totalCartValue = await cartfunctions.totalCartAmount(
          requiredCartData
        );
        req.session.totalCartValue=await totalCartValue //totalCart value is added to session
    req.session.requiredCartData=await requiredCartData
    req.session.cartNumber=cartData.products.length
    cartNumber=req.session.cartNumber      


        res.render("cart", {
          user: true,
          userName,
          requiredCartData,
          totalCartValue,
          cartNumber,
        });
      } else {
        res.render("emptycart", { user: true, userName });
      }
    } else {
      res.render("emptycart", { user: true, userName });
    }
  } catch (error) {
    console.log(error.message);
    res.render("error500")
  }
};

// const loadCart = async (req, res) => {
//   try {
//     const userName = req.session.user_Name;
//     const userId = req.session.user_id;

//     const cartData = await cart.aggregate([
//       { $match: { userId } },
//       { $unwind: "$products" },
//       { $lookup: { from: "products", localField: "products.productId", foreignField: "_id", as: "product" } },
//       { $unwind: "$product" },
//       { $project: {
//           _id: 0,
//           name: "$product.name",
//           quantity: "$products.quantity",
//           price: "$product.price",
//           totalPrice: { $multiply: ["$products.quantity", "$product.price"] },
//           image: "$product.image"
//         }
//       }
//     ]);

//     console.log(cartData);
//     res.render("cart", { user: true, userName, requiredCartData: cartData });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

//adding product to cart

const addToCart = async (req, res) => {
  try {

    const productId = req.body.product;
    usersId = req.session.user_id;

    let isCart = await cart.findOne({ userId: usersId }).lean(); //find user cart
    let isStock = await product
      .findOne({ _id: productId }, { _id: 0, stock: 1, price: 1 })
      .lean(); //finding stock
    let price = isStock.price;
   let stock=isStock.stock

    if (isStock.stock <= 0) {
      return res.json({ message: "Out Of Stock",stock });
    }
    //checking products available or not
    if (isCart) {
      let productExists = await cart.findOne({
        userId: usersId,
        "products.productId": productId,
      });
      // if available increment product qty
      if (productExists) {
        // const stockLimit=await cart.findOne({"products.$.productId": productId },{"products.quantity": 1})
        // const stockLimit = await cart.findOne(
        //   { "products.productId": productId },
        //   { "products.$": 1, _id: 0 }
        // );

        // console.log(stockLimit);

        // await cart.updateOne(
        //   { userId: usersId, "products.productId": productId },
        //   { $inc: { "products.$.quantity": 1, "products.$.totalPrice": price } }
        // );
        return res.json({ message: "success",stock });
      } else {
        await cart.findOneAndUpdate(
          { userId: usersId },
          {
            $push: {
              products: {
                productId: productId,
                quantity: 1,
                totalPrice: price,
              },
            },
          }
        );
      }
    } else {
      await cart.create({
        userId: usersId,
        products: { productId: productId, quantity: 1, totalPrice: price },
      });
    }
    // cart number
    cartData = await cart
    .findOne({ userId: usersId })
    .populate("products.productId")
    .lean();
   if(cartData){

     req.session.cartNumber=cartData.products.length
   }
   
    cartNumber=req.session.cartNumber

    return res.json({ message: "success",stock });
  } catch (error) {
    console.log(error.message);
    res.render("error500")
  }
};

//----------------------------------------------------update quantity--------------------------

const updateQuantity = async (req, res) => {
  try {
    const { prodId, newQuantity, index } = req.body;
    convertedQuantity = parseInt(newQuantity);
    let userId = req.session.user_id;
    let isStock = await product
      .findOne({ _id: prodId }, { stock: 1, price: 1, _id: 0 })
      .lean();
    let stock = isStock.stock;
    console.log(stock);
    if (isStock.stock <= 0) {
      res.json({ message: "out of stock" });
    }
    if (convertedQuantity >= isStock.stock) {
      res.json({ message: "out of stock", stock });//gte
    }
    const singlePrice = isStock.price;
    const updateCart = await cart.updateOne(
      { userId: userId, "products.productId": prodId },
      {
        "products.$.quantity": convertedQuantity,
        "products.$.totalPrice": singlePrice * convertedQuantity,
      }
    );
    const cartData = await cart
      .findOne({ userId: userId, "products.productId": prodId })
      .populate("products.productId")
      .lean();

    const totalPrice = cartData.products[index].totalPrice;
    const quantity = cartData.products[index].quantity;
    const cartTotal = cartfunctions.totalCartAmount(cartData.products);

    return res.json({
      message: "the product quantity changed",
      quantity,
      totalPrice,
      cartTotal,
      stock

    });
  } catch (error) {
    console.log(error);
    res.render("error500")
  }
};

//--------------------delete cart--------------------------------

const deleteCartProduct = async (req, res) => {
  try {

    const usersId = req.session.user_id;
     const prodId = req.params.prodId;
     console.log(prodId);
    await cart.updateOne(
      { userId: usersId },
      { $pull: { products: { productId: prodId } } }
    );
    // res.redirect("/loadcart");
    res.json({message:"deleted"})
  } catch (error) {
    console.log(error);
    res.render("error500")
  }
};
//---------------------------------------------checkout--------------------------------

const loadCheckout = async (req, res) => {
  try {
    const userId = req.session.user_id;

    selectedAddress=req.session.selectedAddress
   
    userName = req.session.user_Name;

    console.log(userName);

    const cartData = await cart
      .findOne({ userId: userId })
      .populate("products.productId")
      .lean();

    const { products } = cartData;

    const requiredCartData = products.map(({ productId, totalPrice }) => ({
      prodId: productId._id,
      name: productId.name,
      totalPrice,
    }));
    
   
    const totalCartValue = await cartfunctions.totalCartAmount(requiredCartData);
    const discountAmount=0
    const discountedTotal=totalCartValue-discountAmount

    req.session.discountAmount=discountAmount
    req.session.discountedTotal=discountedTotal
    

    const findAddress=await address.findOne({userId:userId}).lean()
    // if(findAddress){
      
     if(findAddress){

      const addressData=await address.find({userId:userId}).lean()
      const selectedAddress=findAddress.address[0]

      //find coupon code to show

      const couponCode=await coupon.find({expiryDate:{$gt:Date.now()}}).limit(1).lean()
     

      res.render("checkout", {
        user: true,
        userName,
        requiredCartData,
        discountAmount,
        discountedTotal,
        totalCartValue,
        selectedAddress,
        couponCode,
        addressData,
        cartNumber
      });

    }
    else{
      res.redirect("/addnewaddress")
    }
    

  } catch (error) {
    console.log(error.message);
    res.render("error500")
  }
};

module.exports = {
  loadCart,
  loadCheckout,
  deleteCartProduct,
  addToCart,
  updateQuantity,
};





























// const addToCart = async (req, res) => {
//   try {
//     const productId = req.body.product;
//     const userId = req.session.user_id;
//     const product = await product.findOne({ _id: productId, stock: { $gt: 0 } }, { price: 1 }).lean();
//     if (!product) {
//       return res.json({ message: "Out Of Stock" });
//     }
//     const cartData = await cart.findOne({ userId }).lean();
//     if (cartData) {
//       const productIndex = cartData.products.findIndex(p => p.productId == productId);
//       if (productIndex >= 0) {
//         await cart.updateOne(
//           { userId, "products.productId": productId },
//           { $inc: { "products.$.quantity": 1 } }
//         );
//       } else {
//         cartData.products.push({ productId, quantity: 1, price: product.price });
//         await cart.updateOne({ _id: cartData._id }, { $set: { products: cartData.products } });
//       }
//     } else {
//       await cart.create({ userId, products: [{ productId, quantity: 1, price: product.price }] });
//     }
//     return res.json({ message: "success" });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// function totalCartAmount(requiredCartData){

//   total=requiredCartData.reduce((acc,curr)=>{
//     return acc+curr.totalPrice
//   },0)
//   return total;

// }
