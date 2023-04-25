const category = require("../models/categorymodel");
const product = require("../models/productmodel");


//-----------------------------------------------------------category---------------------------------------------------------------------------------//
//load category page

const loadCategory = async (req, res) => {
    try {
      const categoryList = await category.find();
      res.render("category", { categoryList,admin:true });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  //add new category 
  
  const addCategory = async (req, res) => {
    try {
     const newaddedcategory=req.body.category
     const categoryList=await category.find()
     const categoryExists=await category.exists({name:newaddedcategory})
     if(categoryExists){
      res.render("category",{admin:true,failmessage:"category exists",categoryList})
     }
     else{
      const newCategory = new category({
        name: newaddedcategory,
      });
     
      const addCategory = await newCategory.save();
      if (addCategory) {
        res.redirect("/categorymanagement");
        // ,{addcategorymessage:"successfully added"}
      }
    }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  //delete category
  
  // const deleteCategory = async (req, res) => {
  //   try {
  //     const category_id = req.body.category;
  
  //     if (category_id) {
  //       const deletedCategory = await category.findByIdAndDelete(category_id);
  //       if (deletedCategory) {
  //         // res.render("category",{deletecategorymessage:"successfully deleted"})
  //         res.redirect("/categorymanagement");
  //       }
  //     } else {
  //       res.redirect("/categorymanagement");
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  
  //edit category
  
  const editCategory=async(req,res)=>{
    try{
  
         const category_id=req.params.id
         
         const categoryData=await category.findById(category_id)
        
         res.render("editcategory",{admin:true,categoryData})
  
    }
    catch(error){
      console.log(error.message);
    }
  }
//--------------------------------------------update-----------------------------------------------------------------------

  const updateCategory=async(req,res)=>{
    try{
  
      const categoryList=await category.find()
      const categoryExists=await category.exists({name:req.body.categoryname})
      if(categoryExists){
       res.render("editcategory",{admin:true,failmessage:"category exists",categoryList})
      }
      else{
       
      const updatedCategory=await category.findByIdAndUpdate({_id:req.params.id},{$set:{name:req.body.categoryname}})
      
      res.redirect("/categorymanagement")
      } 
  
    }
    catch(error){
      console.log(error.message);
    }
  }
    //unlistCategory

const unlistCategory = async (req, res) => {
  try {
    
console.log("hiiiii");
    const categoryData = await category.findByIdAndUpdate({_id:req.params.id},{$set:{isListed:false}});
    if (categoryData) {

      res.redirect("/categorymanagement");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//listCategory

const listCategory = async (req, res) => {
  try {
   
    // const user_id = req.params.id;

    const categoryData = await category.findByIdAndUpdate({_id:req.params.id},{$set:{isListed:true}});
    if (categoryData) {

      res.redirect("/categorymanagement");
    }
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = {
    loadCategory,
    addCategory,
    // deleteCategory,
    editCategory,
    updateCategory,
    listCategory,
    unlistCategory
    
    };
  