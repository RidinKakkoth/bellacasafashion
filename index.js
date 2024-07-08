const mongoose=require("mongoose")
mongoose.set('strictQuery', true);
require("dotenv").config()


mongoose.connect(process.env.server_key)

const express=require("express")
const app=express()

var path = require("path");
var hbs = require("express-handlebars")
const bodyParser=require("body-parser")
const session=require("express-session")
const flash = require('connect-flash');
const methodOverride = require('method-override');
// const handlebars = require('handlebars');
const nocache = require("nocache");
const cookieParser = require('cookie-parser');
const helpers=require("./middleware/helpers")


app.use(session({secret:process.env.session_key,cookie:{maxAge:600000},resave: false,
saveUninitialized: false}))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(flash());
app.use(methodOverride('_method'));
app.set("view engine","hbs")
app.use(cookieParser());
app.use(nocache());


// initialize hbs engine
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },

  helpers: helpers
  })
);



  app.use(express.static(path.join(__dirname, "public")));

  app.use((req,res,next)=>{
    console.log(req.method+req.originalUrl);
    next();
  })

const userRoute=require("./routes/userroute");
const adminRoute=require("./routes/adminroute");


app.use("/",userRoute)
app.use("/",adminRoute)



const port = process.env.PORT || 3000; 

app.listen(port,()=>{
    console.log("server running successfully"); 
})

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
//   });
  
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render("../error.hbs");
  });