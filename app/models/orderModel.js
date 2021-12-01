const mongoose=require("mongoose")
const validator=require("validator")
const orderSchema=mongoose.Schema({
    customerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    name:{
      type:String,
      required:true
    },
    items:{
      type:Object,
      required:true
    },
    pin:{
      type:String,
      required:true
    },
    phone:{
      type:String,
      required:true,
    },
    email:{
      type:String,
      required:true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("email is not valid")
        }
      }
    },
    address:{
      type:String,
      required:true

    },
    paymentType:{
      type:String,
      default:"COD"
    },
    status:{
      type:String,
      default:"order_placed"
    }
},{timestamps:true})
const orderModel=mongoose.model("Order",orderSchema)

module.exports=orderModel
