const banner=require("../models/bannermodel");
const { loadAddProduct } = require("./productcontroller");

const bannerTable=async(req,res)=>{
    try{
        
        const bannerData=await banner.find()
          res.render("bannertable",{admin:true,bannerData})

    }
    catch(error){
        console.log(error.message);
    }
}

const addBanner=async(req,res)=>{
    try{
        //    const{heading,description}=req.body
           const imageFile=req.file.filename

           const newBanner=new banner({
             heading:req.body.heading,
             description:req.body.description,
             image:imageFile,
             bannerType:req.body.bannersize
             
           })
           const addedBanner=await newBanner.save()
           res.redirect("/bannertable")
    }
    catch(error){
        console.log(error.message);
    }
}
const loadAddBanner=async(req,res)=>{
    try{
           res.render("addbanner",{admin:true})
    }
    catch(error){
        console.log(error.message);
    }
}

const editBanner=async(req,res)=>{
    try{
         const bannerId=req.params.id
         const bannerData=await banner.findOne({_id:bannerId})
         res.render("editbanner",{admin:true,bannerData})

    }
    catch(error){
        console.log(error.message);
    }
}

const updatebanner=async(req,res)=>{
    try{
        const bannerId=req.params.id

         const bannerFind=await banner.findByIdAndUpdate({_id:bannerId},{$set:{ heading:req.body.heading,
          description:req.body.description,bannerType:req.body.bannersize
         }})
         
         console.log(bannerFind);

      const dataBanner=await banner.findById(bannerId).lean()
  
          if(bannerFind){
        // res.render("bannertable",{admin:true,dataBanner,bannerId})
        res.redirect("/bannertable")
      }

    }
    catch(error){
        console.log(error.message);
    }
}

const updatebannerimage=async(req,res)=>{
    try {
        const bannerId=req.params.id
        const imageFilename = req.file.filename // Get an array of filenames from req.files
  
           const bannerFind=await banner.findByIdAndUpdate({_id:bannerId},{$set:{
            image:imageFilename}})
    
            const bannerData=await banner.findById(bannerId).lean()
        
                if(bannerFind){
                    // res.render("bannertable",{admin:true,bannerData,bannerId})
                    res.redirect("/bannertable")
            }
      
    } catch (error) {
      console.log(error.message);
    }
}

 //unlistProduct

 const unFeatureBanner = async (req, res) => {
    try {
  
      const bannerData = await banner.findByIdAndUpdate({_id:req.params.id},{$set:{isFeatured:false}});
      if (bannerData) {
  
        res.redirect("/bannertable");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  //listProduct
  
  const featureBanner = async (req, res) => {
    try {
    
  
      const bannerData = await banner.findByIdAndUpdate({_id:req.params.id},{$set:{isFeatured:true}});
      if (bannerData) {
  
        res.redirect("/bannertable");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

// const deleteBanner=async(req,res)=>{
//     try{

// const bannerId=req.params.id
// const deleteBannerData=await banner.findByIdAndRemove({_id:bannerId})

// if(deleteBannerData){
//     res.redirect("/bannertable")
// }
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }

module.exports={bannerTable,addBanner,editBanner,loadAddBanner,updatebanner,updatebannerimage,featureBanner,unFeatureBanner}