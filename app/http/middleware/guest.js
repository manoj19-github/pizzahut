const guest=(req,res,next)=>{
  if(!req.session?.passport?.user){
      return next()
  }
  return res.redirect("/")

}
module.exports=guest
