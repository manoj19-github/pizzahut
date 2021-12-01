const Order=require("../../../models/orderModel")
const moment=require("moment-timezone")
const orderCTRL=()=>{
  return{
    async store(req,res){
      // validate request
      try{
        const {
          name,
          email,
          pin,
          phone,
          address
        }=req.body
        console.log(name,email,pin,phone,address)
        if(!name ||!email||!pin||!phone||!address){
          req.flash("error","All fields are required")
          return res.redirect("/cart")
        }
        const newOrder=new Order({
          customerId:req?.session?.passport?.user,
          items:req.session.cart.items,
          name,
          phone,
          email,
          pin,
          address
        })
        const order=await newOrder.save()
        if(order){
           req.flash("success","Order placed successfully")
           delete req.session.cart
        }

        return res.redirect("/customer/orders")
      }catch(err){
        req.flash("error",`Something went wrong ${err}`)
        return res.redirect("/cart")

      }



    },
    async index(req,res){
      try{
        const myOrders=await Order.find({customerId:req?.session?.passport?.user},
          null,{sort:{'createdAt':-1}})
        res.render("customers/orders",{myOrders,moment})

      }catch(err){
        console.log(err)
      }
    }

  }
}
module.exports=orderCTRL
