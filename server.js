const express=require("express")
const app=express()
const ejs=require("ejs")
const expressLayout=require("express-ejs-layouts")
const path=require("path")

// set Template Engine

//app.use(expressLayout)
app.set("views",path.join(__dirname,"/resources/views"))
app.set("view engine","ejs")

// set Assests files
app.use(express.static("public"))

// routing
app.get("/",(req,res)=>{
  res.render("home")
})

// server port
const PORT=process.env.PORT||4000

// server listening
app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`)
})
