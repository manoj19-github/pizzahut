const Order=require("../../../models/orderModel")
const Product=require("../../../models/productModel")
const moment=require("moment-timezone")
const stripe=require("stripe")(process.env.STRIPE_PRIVATE_KEY)
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
          address,
          paymentType,
          stripeToken
        }=req.body


        if(!name ||!email||!pin||!phone||!address ||!paymentType ||!stripeToken){
          return res.status(422).json({message:"All field are required"})
        }
        const newOrder=new Order({
          customerId:req?.session?.passport?.user,
          items:req.session.cart.items,
          name,
          phone,
          email,
          pin,
          paymentType,
          address
        })
        const order=await newOrder.save()
        Order.populate(order,{path:'customerId'},(error,placedOrder)=>{


             // stripe payment
             if(paymentType==="card"){
               stripe.charges.create({
                 amount:req.session.cart.totalPrice*100,
                 source:stripeToken,
                 currency:"inr",
                 description:`Pizza Order : ${placedOrder._id}`
               }).then(()=>{
                 placedOrder.paymentStatus=true
                 placedOrder.save().then((saved)=>{
                   console.log("saved",saved)
                   const eventEmitter=req.app.get("eventEmitter")
                   eventEmitter.emit("orderPlaced",saved)
                   delete req.session.cart

                   return res.status(201).
                   json({message:"Payment successfull, Order Placed successfully"})

                 }).catch(err=>{
                   console.log("saved err",err)
                 })

               }).catch((err)=>{
                 console.log(err)
                 delete req.session.cart
                 return res.status(201).
                 json({message:"Payment failed, Order Placed You can pay at delivery time"})

               })
             }
        })
        // Emit event


      }catch(err){
        console.log(err)
        return res.status(500).
        json({message:`something went wrong : ${err}`})


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
