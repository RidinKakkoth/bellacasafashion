const admin = require("../models/adminmodel");
const user = require("../models/usermodel");
const category = require("../models/categorymodel");
const product=require("../models/productmodel")
const mongoose=require("mongoose")
const order=require("../models/ordermodel")

const PDFDocument = require('pdfkit');
const Excel = require('exceljs');



const bcrypt = require("bcrypt");
const fs=require("fs")
const multer=require("multer");
// const upload = multer({ dest: 'uploads/' });
var adminMail;

//load admin signin page

const loadSignIn = (req, res) => {
  try {
    res.render("adminSignIn");
  } catch (error) {
    console.log(error.message);
  }
};

//register admin

// const registerAdmin=async(req,res)=>{
//     try{
//         console.log("hooooooooooooo");
//         const {email,password }= req.body;
//         console.log(password);
//         const adminExists=await admin.findOne({email:email})
//         console.log(adminExists);
//         const hashPassword=await bcrypt.hash(password,10)

//         const newAdmin= new admin ({

//             email,
//             password:hashPassword

//         })
//         const adminData=await newAdmin.save()

//         if(adminData){
//             res.render("adminSignIn",{message:"successfully registered!! Please Login"})
//         }
//         else{
//             res.render("adminSignIn",{failmessage:"registration failed"})
//         }
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }

//admin signin

const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminCred = await admin.findOne({ email: email });
    if (adminCred) {
      const status = await bcrypt.compare(password, adminCred.password);
      if (status) {
        req.session.adminloggedin=adminCred._id
        req.session.adminMail=adminCred.email
        adminMail= req.session.adminMail
        // res.render("dashboard",{admin:true,adminMail});
        res.redirect("/admindashboard");
      }
      else{
        res.render("adminSignIn",{failmessage:"invalid Credentials"})
      }
    }
    else{
      res.render("adminSignIn",{failmessage:"invalid Credentials"})
    }
  } catch (error) {
    console.log(error.message);
  }
};

//load admin dashboard

const loadDashboard = async (req, res) => {
  try {
    //for table
    const salesReportData = await order.find({$or:[{orderStatus:"delivered"}]})

    //for charts

    let ord=0;
    let can=0;
    let pen=0;
    let dis=0;
    let del=0;
    let mo=0;let tu=0;let we=0;let th=0;let fr=0;let sa=0;let su=0;

    const orderData=await order.find({orderStatus:'delivered'}).lean();


    
    for (i=0;i<orderData.length;i++){
        const date = new Date(orderData[i].createdAt);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
     

            if(dayOfWeek.toUpperCase()=="MONDAY"){
            mo++;
          }
        if(dayOfWeek.toUpperCase()=="TUESDAY"){
            tu++;
          }
        if(dayOfWeek.toUpperCase()=="WEDNESDAY"){
            we++;
          }
        if(dayOfWeek.toUpperCase()=="THURSDAY"){
            th++;
          }
        if(dayOfWeek.toUpperCase()=="FRIDAY"){
            fr++;
          }
        if(dayOfWeek.toUpperCase()=="SATURDAY"){
            sa++;
          }
        if(dayOfWeek.toUpperCase()=="SUNDAY"){
            su++;
          }

    }

    const orderD=await order.find()
    for(i=0;i<orderD.length;i++){
   
   if(orderD[i].orderStatus=="ordered"){
     ord++;
   }
   if(orderD[i].orderStatus=="cancelled"){
     can++;
   }
   if(orderD[i].orderStatus=="pending"){
     pen++;
   }
   if(orderD[i].orderStatus=="dispatched"){
     dis++;
   }
   if(orderD[i].orderStatus=="delivered"){
     del++;
   }
  }




    res.render("dashboard",{admin:true,salesReportData,ord,can,pen,dis,del,mo,tu,we,th,fr,sa,su,adminMail});
  } catch (error) {
    console.log(error.message);
  }
};

//----------------------------------------------------------------------sales----------------------------------------------------------------------//

const salesReport=async(req,res)=>{
  try {
    salesData = req.query.data
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (salesData == "day") {

        const currentDay = currentDate.getDate();
        
        const salesReportData = await order.find({
          createdAt: {
            $gte: new Date(currentYear, currentMonth - 1, currentDay), // Start of today
            $lt: new Date(currentYear, currentMonth - 1, currentDay + 1) // End of today
          }
        }).populate("products.productId").populate("address").lean();

        // const orderData = salesReportData.map((i) => {
        //   return i.products.map(({ productId, totalPrice, quantity }) => ({
        //     name: productId.name,
        //     image: productId.image,
        //     totalPrice,
        //     quantity,
        //   }));
        // }).flat();
        
        // const addressData= salesReportData.map((i)=>{
        //   return i.address
        // })

        res.render("dashboard",{salesReportData,admin:true})

    }
    else if(salesData == "month"){

const salesReportData = await order.find({
  $expr: {
    $and: [
      { $eq: [{ $month: '$createdAt' }, currentMonth] }, // Compare month
      { $eq: [{ $year: '$createdAt' }, currentYear] } // Compare year
    ]
  }
});

res.render("dashboard",{salesReportData,admin:true})
    }
    else if(salesData == "year"){
      const salesReportData = await order.find({
        $expr: {
          $eq: [{ $year: '$createdAt' }, currentYear] // Compare year
        }
      });
      res.render("dashboard",{salesReportData,admin:true})

    }
  
  } catch (error) {
    console.log(error.message);
  }
}
//----------------------------------------------------------------------downloadPdf----------------------------------------------------------------------//
const downloadPdf = async (req, res) => {
  try {
    const { timePeriod } = req.query;

    let orders = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Generate orders array based on selected time period
    switch (timePeriod) {
      case 'today':
        orders = await order.find({
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        });
        break;
      case 'thisMonth':
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;

        orders = await order.find({
          $expr: {
            $and: [
              { $eq: [{ $month: '$createdAt' }, currentMonth] },
              { $eq: [{ $year: '$createdAt' }, currentYear] }
            ]
          }
        });
        break;
      case 'thisYear':
        orders = await order.find({
          $expr: {
            $eq: [{ $year: '$createdAt' }, currentYear]
          }
        });
        break;
      default:
        // Handle invalid time period
        return res.status(400).send('Invalid time period');
    }

    const pdfFileName = await generateOrderPDF(orders, timePeriod, res);
    res.download(pdfFileName); // Remove res.redirect('back')
  } catch (error) {
    console.log(error.message);
  }
}



async function generateOrderPDF(orders, title, res) {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the response headers for PDF file
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${title}.pdf`);

  // Pipe the PDF document to a write stream
  const writeStream = fs.createWriteStream(`${title}.pdf`);
  doc.pipe(writeStream);

  // Add order data to PDF in table format
  doc.fontSize(18).text(title, { underline: true }).moveDown();
  doc.fontSize(12).font('Helvetica-Bold');
  doc.text('Order Date', 50, 100);
  doc.text('Order Id', 200, 100);
  doc.text('Amount', 370, 100);
  doc.text('Payment Type', 450, 100);
  doc.text('Status', 550, 100);
  doc.moveTo(40, 120).lineTo(560, 120).stroke();
  doc.font('Helvetica');

  let yPos = 140;
  orders.forEach(order => {
    const orderDate = order.createdAt.toString().slice(0,24); // Extract only the date part
    doc.fontSize(12).text(orderDate, 40, yPos);
    doc.text(order._id, 200, yPos);
    doc.text(order.totalAmount, 380, yPos);
    doc.text(order.paymentType, 450, yPos);
    doc.text(order.orderStatus, 550, yPos);
    yPos += 20;
  });

  // Finalize the PDF document
  doc.end();

  return `${title}.pdf`; // Return the PDF file name
}



//----------------------------------------------------------------------downloadexcel----------------------------------------------------------------------//

const downloadExcel = async (req, res) => {
  try {
    const { timePeriod } = req.query;

    let orders = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Generate orders array based on selected time period
    switch (timePeriod) {
      case 'today':
        orders = await order.find({
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        });
        break;
      case 'thisMonth':
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;

        orders = await order.find({
          $expr: {
            $and: [
              { $eq: [{ $month: '$createdAt' }, currentMonth] },
              { $eq: [{ $year: '$createdAt' }, currentYear] }
            ]
          }
        });
        break;
      case 'thisYear':
        orders = await order.find({
          $expr: {
            $eq: [{ $year: '$createdAt' }, currentYear]
          }
        });
        break;
      default:
        // Handle invalid time period
        return res.status(400).send('Invalid time period');
    }

    await generateOrderExcel(orders, timePeriod, res); // Call the function to generate Excel file
  } catch (error) {
    console.log(error.message);
  }
}


const generateOrderExcel = async (orders, title, res) => {
  // Create a new Excel workbook
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet(title); // Add a new worksheet

  // Add column headers
  sheet.addRow(['Order Date', 'Order Id', 'Total Amount', 'Payment Type', 'Order Status']);

  // Add order data to Excel sheet
  orders.forEach(order => {
    sheet.addRow([order.createdAt, order._id, order.totalAmount, order.paymentType, order.orderStatus]);
  });

  // Set the response headers for Excel file
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${title}.xlsx`);

  // Write the Excel workbook to response stream
  await workbook.xlsx.write(res);
  res.end();
}

//----------------------------------------------------------------------user management----------------------------------------------------------------------//


//load user management page

const userManagement = async (req, res) => {
  try {
    const userdata = await user.find();

    res.render("usermanagement", { userdata,admin:true ,adminMail});
  } catch (error) {
    console.log(error.message);
  }
};

//load add user page

const loadAddUser = async (req, res) => {
  try {
    res.render("adduser",{admin:true});
  } catch (error) {
    console.log(error.message);
  }
};

//add new user

// const addUser = async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;
//     const hashPassword = await bcrypt.hash(password, 10);
//     const userCred = await user.findOne({ email });

//     if (userCred) {
//       res.render("adduser", { failmessage: "user already exists",admin:true });
//       return;
//     }
//     console.log(name);
//     const newUser = new user({
//       name,
//       email,
//       phone,
//       password: hashPassword,
//       isVerified: 1,
//     });
//     const adduser = await newUser.save();
//     if (adduser) {
//       res.redirect("/usermanagement");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

//load user editing page

// const loadEditUser = async (req, res) => {
//   try {
//     let user_id = req.params.id;
//     // console.log(user_id);
//     if (user_id) {
//       const userdata = await user.findById(user_id);
//       //  console.log(userdata);
//       res.render("edituser", { userdata:userdata});
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

//update edited details

// const updateUserdata = async (req, res) => {
//   try {
//     const { name, phone, email } = req.body;
//     const updateUser_id = req.params.id;
//     const updatedData = await user.updateOne(
//       {_id:updateUser_id },
//       {
//         $set: {
//           name,
//           email,
//           phone,
//         },
//       }
//     );
//     if (updatedData) {
//       res.redirect("/usermanagement");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

//block a user

const blockUser = async (req, res) => {
  try {
    // const user_id = req.params.id;

    const userdata = await user.findById(req.params.id);
    if (userdata) {
      const setBlock = await user.updateOne(
        { _id:req.params.id},
        { $set: { isBlocked: true } }
      );
      res.redirect("/usermanagement");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//unblock a user

const unblockUser = async (req, res) => {
  try {
    // const user_id = req.params.id;

    const userdata = await user.findById(req.params.id);
    if (userdata) {
      const setBlock = await user.updateOne(
        { _id:req.params.id },
        { $set: { isBlocked: false } }
      );
      res.redirect("/usermanagement");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//---------------------------------------------------------------------------------------------------------------------------//


//admin signout

const adminSignOut =async (req,res)=>{
  try{
    req.session.adminloggedin=null
    res.redirect("/admin")

  }
  catch(error){
    console.log(error.message);
  }

}

module.exports = {
  loadSignIn,
  adminSignIn,
  loadDashboard,
  salesReport,
  downloadPdf,
  downloadExcel,
  userManagement,
  loadAddUser,
  // addUser,
  // loadEditUser,
  // updateUserdata,
  blockUser,
  adminSignOut,
  unblockUser,
};
