

//  AUTHENTICATION  MIDDLEWARE LOGIN

const isSignin=async(req,res,next)=>{
    try {
        if(req.session.user_id){ }
        else{
            res.redirect('/signin')
        }
        next();   
    }
     catch (error) {
       console.log(error.message); 
    }}

//  AUTHENTICATION  MIDDLEWARE LOGOUT

const isSignout=async(req,res,next)=>{
    try {
        if(req.session.user_id){
        
            res.redirect('/home')
        }next()
    } catch (error) {
       console.log(error.message); 
    }}
//---------------------------------------------------------admin---------------------

   //  AUTHENTICATION  MIDDLEWARE LOGIN

const isAdminSignin=async(req,res,next)=>{
    try {
        if(req.session.adminloggedin){ }
        else{
            res.redirect('/admin')
        }
        next();   
    }
     catch (error) {
       console.log(error.message); 
    }}

//  AUTHENTICATION  MIDDLEWARE LOGOUT

const isAdminSignout=async(req,res,next)=>{
    try {
        if(req.session.adminloggedin){
        
            res.redirect('/admindashboard')
        }next()
    } catch (error) {
       console.log(error.message); 
    }}

module.exports={isSignin,isSignout,isAdminSignin,isAdminSignout}