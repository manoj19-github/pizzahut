const User=require("../../models/userModel")
const validator=require("validator")
const bcrypt=require("bcrypt")
const passport=require("passport")
const authController=()=>{
  return{
    login(req,res){
      res.render("auth/login")
    },
    register(req,res){
      res.render("auth/register")
    },
    async postRegister(req,res){
      const {name,email,password}=req.body
      //  validate request
      if(!name || !email || !password){
        req.flash("error","All Fields are required !!")
        req.flash('name',name)
        req.flash('email',email)
        return res.redirect("/register")
      }else if(!validator.isEmail(email)){
        req.flash("error","email Id not valid !!")
        req.flash('name',name)
        req.flash('email',email)
        return res.redirect("/register")
      }else if(password.length<4 || password.length>30 ){
        req.flash("error","password must be  4 to 30 character long")
        req.flash('name',name)
        req.flash('email',email)
        return res.redirect("/register")
      }
      //  check if email exists
      try{
        const existsUser=await User.findOne({email})
        if(existsUser){
          req.flash("error","email already registered")
          req.flash('name',name)
          req.flash('email',email)
          return res.redirect("/register")
        }else{
          const hashPassword=await bcrypt.hash(password,10)
          const newUser=new User({
            name,
            email,
            hashPassword
          })
          newUser.save((err,user)=>{
            // login
            if(user) return res.redirect("/")
            if(err){
              req.flash("error",`internal server error ${err}`)
              req.flash('name',name)
              req.flash('email',email)
              return res.redirect("/register")

            }
          })


        }

      }catch(err){
        req.flash("error",`internal server error ${err}`)
        req.flash('name',name)
        req.flash('email',email)
        return res.redirect("/login")
      }


    },
    async localLogin(req,res,next){
      const {email,password}=req.body
      //  validate request
      if( !email || !password){
        req.flash("error","All Fields are required !!")


        return res.redirect("/login")
      }else if(!validator.isEmail(email)){
        req.flash("error","email Id not valid !!")

        return res.redirect("/login")
      }else if(password.length<4 || password.length>30 ){
        req.flash("error","password must be  4 to 30 character long")
        return res.redirect("/login")
      }

        passport.authenticate("local",(err,user,info)=>{
          if(err){
            req.flash("error",info.message)
            return res.redirect("/login")
          }
          if(!user){
            req.flash("error",info.message)
            return res.redirect("/login")
          }
          req.logIn(user,(err)=>{
            if(err){
              req.flash("error",info.message)
              return next(err)
            }
            if(user){
              console.log(user)

              return res.redirect("/")
            }
          })
        })(req,res,next)
    },
    logout(req,res){
      req.logout()
      return res.redirect("/  ")
    }


  }
}
module.exports=authController
