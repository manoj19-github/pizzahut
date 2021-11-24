const homeController=require("../app/http/controllers/homeController")
const authController=require("../app/http/controllers/authController")
const cartController=require("../app/http/controllers/customers/cartController")


const initRoutes=(app)=>{
  // routing
  app.get("/",homeController().index)
  app.get("/cart",cartController().index)
  app.get("/login",authController().login)
  app.get("/register",authController().register)
  app.post("/update-cart",cartController().update)
  app.post("/delete-cart",cartController().delete)

}
module.exports=initRoutes
