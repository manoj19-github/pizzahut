const Order=require("../../../models/orderModel")
const statusCTRL=(req,res,next)=>{
  return{
    update(req,res){

        Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,order)=>{
          if(err){
            console.log("myerror",err)
            req.flash("error","status not updated")
            return res.redirect("/admin/orders")
          }
          if(order) {
            // Emit event
            const eventEmitter=req.app.get("eventEmitter")
            if(req.body.status==="delivered"){
              eventEmitter.emit("paymentUpdated",{id:req.body.orderId,payment:"paid"})

            }
            eventEmitter.emit("orderUpdated",{id:req.body.orderId,status:req.body.status})
            req.flash("success","status  updated successfully")
            return res.redirect("/admin/orders")
          }
        })



    }
  }
}
module.exports=statusCTRL
