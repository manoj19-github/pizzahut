const Order=require("../../../models/orderModel")

const adminOrderController=()=>{
  return{
     index(req,res){
       Order.find({$and :[{status:{$ne:"delivered"}},{status:{$ne:"rejected"}}]},null,{sort:{'createdAt':-1}})
        .populate('customerId','-password')
        .exec((err,orders)=>{
          if(err){
            console.log(err)
            req.flash("error","something went wrong ")
            return res.redirect("/")
          }
          if(req.xhr) return res.json(orders)

          return res.render('admin/orders')


        })



    }
  }
}
module.exports=adminOrderController
