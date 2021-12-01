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
        Order.populate(order,{path:'customerId'},(error,placedOrder)=>{
             req.flash("success","Order placed successfully")
             delete req.session.cart
             const eventEmitter=req.app.get("eventEmitter")
             eventEmitter.emit("orderPlaced",placedOrder)
             console.log("order placed")
             return res.redirect("/customer/orders")
        })
        // Emit event


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
        res.redirect("/")
      }
    },
    async showOrder(req,res){

      try{
        const order=await Order.findById(req.params.id)
        // authorized User
        if(req?.session?.passport?.user.toString()===order.customerId.toString())

          return res.render("customers/singleOrder",{order})
        return res.redirect("/")



      }catch(err){

      }


    }

  }
}
module.exports=orderCTRL
