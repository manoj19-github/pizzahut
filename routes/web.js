const express=require("express")
const Router=express.Router()
const homeController=require("../app/http/controllers/homeController")
const authController=require("../app/http/controllers/authController")
const cartController=require("../app/http/controllers/customers/cartController")
const guest=require("../app/http/middleware/guest")
const passport=require("passport")
  // routing
  Router.get("/",homeController().index)
  Router.get("/cart",cartController().index)
  Router.get("/login",guest,authController().login)
  Router.post("/login",authController().localLogin)
  Router.get("/register",guest,authController().register)

  Router.post("/register",authController().postRegister)
  Router.post("/logout",authController().logout)
  Router.post("/update-cart",cartController().update)
  Router.post("/delete-cart",cartController().delete)


module.exports=Router
