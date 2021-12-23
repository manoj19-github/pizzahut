const User=require("../../models/userModel")

const isLoggedIn=(req,res,next)=>{
  if(!req.session?.passport?.user){
      return next()
  }
  return res.redirect("/")

}
const isUser=(req,res,next)=>{
  if(req.session?.passport?.user){
      return next()
  }
  req.flash("login first then try again")
  return res.redirect("/login")

}
const isAdmin=async(req,res,next)=>{

    try{
      if(req.session?.passport?.user){
        const admin=await User.find({$and:[{_id:req.session.passport.user},{role:"admin"}]})
        if(admin.length>0) return next()
        else{
          req.flash("error","this is page can only for admin")
          return res.redirect("/login")
        }
      }else{
        return res.redirect("/login")
      }

    }catch(err){
      console.log(err)
      return res.redirect("/login")
    }
}

const checkAdmin=async(userId)=>{

    try{
      if(userId){
        const admin=await User.find({$and:[{_id:userId},{role:"admin"}]})
        if(admin.length>0) return true
      }
      return false
    }catch(err){
      console.log("auth page",err)
      return false
    }
}


module.exports={isLoggedIn,isUser,isAdmin,checkAdmin}
