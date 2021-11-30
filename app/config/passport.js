const LocalStrategy=require("passport-local").Strategy
const User=require("../models/userModel")

const localPassport=(passport)=>{
  // passport validation
    passport.use(new LocalStrategy({usernameField:"email"},async(email,password,done)=>{
      // login
      try{
          const user=await User.findOne({email})
          if(!user){
            return done(null,false,{message:'No User with this Email'})
          }
          // checking password

          if(await user.authenticate(password)){
            return done(null,user,{message:"Logged in Successfully"})
          }else{
            return done(null,false,{message:"Wrong username or password"})
          }
      }catch(err){
        return done(null,false,{message:`Something went wrong ${err}`})
      }



    }))

    // after login successfull store data on session

    passport.serializeUser((user,done)=>{
      done(null,user._id)
    })

    // get data from session
    passport.deserializeUser((id,done)=>{
      User.findById(id,(err,user)=>{
        done(err,user)
      })

    })




}

module.exports=localPassport
