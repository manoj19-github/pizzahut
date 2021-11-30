const {check,validationResult}=require("express-validator")
exports.validationSignupResult=[
  check("name")
  .notEmpty()
  .withMessage("name is required"),
  check("email")
  .isEmail()
  .withMessage("email is not valid"),
  check("password")
  .isLength({min:4,max:30})
  .withMessage("password must be at least 4 to 30 character")
]
exports.validateSigninRequest=[
  check("email")
  .isEmail()
  .withMessage("email is not valid"),
  check("password")
  .isLength({min:4,max:30})
  .withMessage("password must be at least 4 to 30 character")
]
exports.isRequestValidated=(req,res,next)=>{
  const errors=validationResult(req)
  if(errors.array().length>0){
    return res.status(400).json({errors:errors.array()[0].msg})
  }
  next()

}
