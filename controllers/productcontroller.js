
const category = require("../models/categorymodel");
const product=require("../models/productmodel")


//----------------------------------------------------------products----------------------------------------------------------------------------------//

//view product list page

const viewProductList = async (req, res) => {
    try {
  
      const productData = await product.find().populate('category').lean();
  
      res.render("productlist",{productData,admin:true});
    } catch (error) {
      console.log(error.message);
    }
  };
  
  //load add product page
  
  const loadAddProduct = async (req, res) => {
    try {
      const categoryList=await category.find()
      
      res.render("addproducts",{categoryList,admin:true});
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // add products to database
  
  // const addProduct = async (req, res) => {
  //   try {
        
  //       const{category,productname,description,price,quantity}=req.body
        
  //       const newProduct=await new product({
  //         name:productname,
  //         description:description,
  //         price:price,
  //         stock:quantity,
  //         category:category,
  //         image:req.file.filename
  //       })
  //       if(newProduct){
  //        const addedProduct=await newProduct.save()
  //        res.redirect("/addproduct")
  //       }
      
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const addProduct = async (req, res) => {
    try {
        
        const{category,productname,description,price,quantity}=req.body
        const imageFilenames = req.files.map((file) => file.filename); // Get an array of filenames from req.files
        
        const newProduct=await new product({
          name:productname,
          description:description,
          price:price,                                                 
          stock:quantity,
          category:category,
          image:imageFilenames
        })
        if(newProduct){
         const addedProduct=await newProduct.save()
         res.redirect("/addproduct")
        }
      
    } catch (error) {
      console.log(error.message);
    }
  };

  //unlistProduct

const unlistProduct = async (req, res) => {
  try {

    const productData = await product.findByIdAndUpdate({_id:req.params.id},{$set:{isListed:false}});
    if (productData) {

      res.redirect("/viewproductlist");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//listProduct

const listProduct = async (req, res) => {
  try {
    // const user_id = req.params.id;

    const productData = await product.findByIdAndUpdate({_id:req.params.id},{$set:{isListed:true}});
    if (productData) {

      res.redirect("/viewproductlist");
    }
  } catch (error) {
    console.log(error.message);
  }
};
  
  const editProduct = async (req, res) => {
    try {
      const product_id=req.params.id
      const categoryList=await category.find()
      const dataProduct=await product.findById(product_id).populate('category').lean()
     
      res.render("editproduct",{admin:true,dataProduct,categoryList,product_id})
      
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const updateProduct = async (req, res) => {
    try {
      const product_id=req.params.id
      
      const{categoryname,productname,description,price,quantity}=req.body
      // const imageFilenames = req.files.map((file) => file.filename); // Get an array of filenames from req.files

      
         const productFind=await product.findByIdAndUpdate({_id:product_id},{$set:{ name:productname,
          description:description,
          price:price,
          stock:quantity,
          category:categoryname,
         }})
         
      const dataProduct=await product.findById(product_id).populate('category').lean()
      const dataProductCategory_id=dataProduct.category._id
      const categoryList=await category.find()
      
  
          if(productFind){
        res.render("editproduct",{admin:true,dataProduct,categoryList,product_id,dataProductCategory_id})
      }
    
  } catch (error) {
    console.log(error.message);
  }
  };

  const updateImage = async (req, res) => {
    try {
      const product_id=req.params.id
      const imageFilenames = req.files.map((file) => file.filename); // Get an array of filenames from req.files

      
         const productFind=await product.findByIdAndUpdate({_id:product_id},{$set:{
          image:imageFilenames}})
  
          const dataProduct=await product.findById(product_id).populate('category').lean()
          const categoryList=await category.find()
      
              if(productFind){
            res.render("editproduct",{admin:true,dataProduct,categoryList,product_id})
          }
    
  } catch (error) {
    console.log(error.message);
  }
  };

  
  

module.exports ={  
  viewProductList,
    listProduct,
    updateImage,
    unlistProduct,
    editProduct,
    loadAddProduct,
    addProduct,updateProduct}