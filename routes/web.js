const express=require("express")
const Router=express.Router()

const homeController=require("../app/http/controllers/homeController")
const authController=require("../app/http/controllers/authController")
const cartController=require("../app/http/controllers/customers/cartController")
const orderController=require("../app/http/controllers/customers/orderController")
const adminOrderController=require("../app/http/controllers/admin/adminOrderController")
const {isLoggedIn,isUser,isAdmin}=require("../app/http/middleware/auth")
const {goToHome,goToLogin}=require("../app/http/middleware/goToHome")

const passport=require("passport")

  // routing

  Router.get("/",homeController().index)
  Router.get("/cart",isUser,cartController().index)
  Router.get("/login",isLoggedIn,authController().login)
  Router.get("/customer/orders",isUser,orderController().index)
  Router.get("/register",isLoggedIn,authController().register)
  Router.get("/admin/orders",isAdmin,adminOrderController().index)

  Router.post("/login",authController().localLogin)
  Router.post("/register",authController().postRegister)
  Router.post("/logout",isUser,authController().logout)
  Router.post("/update-cart",isUser,cartController().update)
  Router.post("/delete-cart",isUser,cartController().delete)
  Router.post("/orders",orderController().store)

module.exports=Router
