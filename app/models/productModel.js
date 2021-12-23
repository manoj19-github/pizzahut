const mongoose=require("mongoose")
const productSchema=mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  image:{
    type:String,
    required:true,
    trim:true
  },
  price:{
    type:Number,
    required:true

  },
  size:{
    type:String,
    required:true,
    trim:true
  }
},{timestamps:true})
const Product=mongoose.model("Product",productSchema)
module.exports=Product
