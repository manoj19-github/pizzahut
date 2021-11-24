const Products=require("../../models/productModel") // product Model
const homeController=()=>{
  return{
    async index(req,res){
      try{
          const products=await Products.find({})
          return res.render("home",{products})
      }catch(err){
        console.log(`database error ${err}`)
      }
    }
  }
}
module.exports=homeController
