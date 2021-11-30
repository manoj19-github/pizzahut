const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const validator=require("validator")
const userSchema=mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("email not valid")
      }
    }
  },
  hashPassword:{
    type:String,
    trim:true
  },
  role:{
    type:String,
    default:'customer'
  }
},{timestamps:true})
userSchema.methods={
  async authenticate(password){
    console.log(password)
    console.log(this.hashPassword)
    return await  bcrypt.compare(password,this.hashPassword)
  }
}
const User=mongoose.model("User",userSchema)
module.exports=User
