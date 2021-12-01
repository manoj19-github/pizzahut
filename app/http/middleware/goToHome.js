exports.goToHome=(req,res,next)=>{
  if(!req?.session?.password?.user) res.redirect("/")

}
exports.goToLogin=(req,res,next)=>{
  if(!req?.session?.password?.user) res.redirect("/login")

}
