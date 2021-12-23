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
const {checkAdmin}=require("./app/http/middleware/auth")
const Emitter=require("events")



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
    key:"user_id",
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

// Event Emitter
const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter)
app.use(flash())

// Global middleware
app.use(async(req,res,next)=>{
  res.locals.session=req.session

  res.locals.user=req?.session?.passport?.user
  try{
    if(await checkAdmin(req?.session?.passport?.user)){
      res.locals.isAdmin=true
    }else{
      res.locals.isAdmin=false
    }
  }catch(err){
    console.log("primary middleware ",err)
  }
  next()
})

//  routes middleware
app.use(passport.initialize())
app.use(passport.session())
localPassport(passport)
app.use("/",webRoutes)
//  for 404 custom error
app.use((req,res)=>{
  res.status(404).render("errors/404")

})
// server port
const PORT=process.env.PORT||5000

// server listening
const server=app.listen(PORT,async()=>{
  // database connection
    await connDB()
  console.log(`server is running on port ${PORT}`)
})


// Socket work
const io=require("socket.io")(server)
io.on("connection",(socket)=>{
  //  Join
  socket.on("join",(orderId)=>{
    socket.join(orderId)
  })
})
eventEmitter.on("orderUpdated",(data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)
})
eventEmitter.on("orderPlaced",(orderData)=>{
  io.to("adminRoom").emit("orderPlaced",orderData)
})
eventEmitter.on("paymentUpdated",(data)=>{
  io.to(`order_${data.id}`).emit("paymentUpdated",data)
})

//io.to(`order_${req.body.orderId}`).emit('paymentUpdated',"paid")
