
const multer=require("multer")


//-----------uploading images

const storage=multer.diskStorage({
    destination:function(req,file,callback){
      const dir="./public/uploads";
      callback(null,dir)
    },
    filename:function (req,file,callback) {
      callback(null,`${Date.now()}-${file.originalname}`);
    }
  })
  
  const upload=multer({storage:storage})
  

//--------------------------------------------------
module.exports=upload