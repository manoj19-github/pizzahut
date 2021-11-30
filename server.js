// Package Requirements
require("dotenv").config()   //for environment resource configuration
const express=require("express")
const app=express()        // setting our express app
const ejs=require("ejs")
const cors=require("cors")
const expressLayout=require("express-ejs-layouts")
const path=require("path")
const mongoose=require("mongoose")
const session=require("express-session")
const flash=require("express-flash")
const MongoDBStore = require('connect-mongo');
const passport=require("passport")
const localPassport=require("./app/config/passport")



// database connection module requirements
const {connDB}=require("./app/config/db")
// routes module requirements
const webRoutes=require("./routes/web")

// set Template Engine
app.use(expressLayout)
app.set("views",path.join(__dirname,"/resources/views"))
app.set("view engine","ejs")

// set Assests files
app.use(express.static("public"))


//express middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// passport configuration



// session configuration
app.use(session({

    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUnitialized: false,
    store:MongoDBStore.create({
      mongoUrl:process.env.DB_URL,
      collectionName:"sessions",
      autoRemove:'interval',
      autoRemoveInterval:20,
    }),
    cookie:{maxAge:1000*60*60},
    //cookie: { secure: true }
}))
app.use(flash())

// Global middleware
app.use((req,res,next)=>{
  res.locals.session=req.session
  res.locals.user=req?.session?.passport?.user
  console.log(res.locals.user)
  console.log(req.session)
  next()
})

//  routes middleware
app.use(passport.initialize())
app.use(passport.session())
localPassport(passport)
app.use("/",webRoutes)

// server port
const PORT=process.env.PORT||5000

// server listening
app.listen(PORT,async()=>{
  // database connection
    await connDB()
  console.log(`server is running on port ${PORT}`)
})
