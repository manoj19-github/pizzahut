const express=require("express")
const Router=express.Router()

const homeController=require("../app/http/controllers/homeController")
const authController=require("../app/http/controllers/authController")
const cartController=require("../app/http/controllers/customers/cartController")
const orderController=require("../app/http/controllers/customers/orderController")
const adminOrderController=require("../app/http/controllers/admin/adminOrderController")
const adminStatusController=require("../app/http/controllers/admin/statusController")
const {isLoggedIn,isUser,isAdmin}=require("../app/http/middleware/auth")
const {goToHome,goToLogin}=require("../app/http/middleware/goToHome")
const {uploads}=require("../app/http/middleware/uploadImage")
//const passport=require("passport")
// const multer=require("multer")
// const shortid=require("shortid")
// const path=require("path")
// const dest=path.join(__dirname,"public/images")
// const storage=multer.diskStorage({
//   destination:function(req,file,cb){
//     cb(null,dest)
//   },
//   filename:function(req,file,cb){
//     cb(null,shortid.generate()+"-"+file.originalname)
//   }
// })
// const uploads=multer({storage})


  // routing

  Router.get("/",homeController().index)
  Router.get("/cart",isUser,cartController().index)
  Router.get("/login",isLoggedIn,authController().login)
  Router.get("/customer/orders",isUser,orderController().index)
  Router.get("/customer/orders/:id",isUser,orderController().showOrder)
  Router.get("/register",isLoggedIn,authController().register)
  Router.get("/admin/orders",isAdmin,adminOrderController().index)
  Router.get("/update-cart",isUser,cartController().check)
  Router.get("/admin/products",isAdmin,adminOrderController().products)

  Router.post(`/admin/product/delete`,isAdmin,adminOrderController().deleteProduct)
  Router.post(`/admin/product/edit`,isAdmin,adminOrderController().editProduct)
  Router.post("/admin/product/insert",isAdmin,uploads.single("image"),adminOrderController().insertOrUpdate)
  Router.post("/admin/order/status",isAdmin,adminStatusController().update)
  Router.post("/login",authController().localLogin)
  Router.post("/register",authController().postRegister)
  Router.post("/logout",isUser,authController().logout)
  Router.post("/update-cart",isUser,cartController().update)
  Router.post("/delete-cart",isUser,cartController().delete)
  Router.post("/orders",orderController().store)

module.exports=Router
