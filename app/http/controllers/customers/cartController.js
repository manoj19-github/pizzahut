const cartController=()=>{
  return{
    index(req,res){
      res.render("customers/cart")
    },
    async delete(req,res){
      if(req.session?.cart?.items[req.body.delId]){
        await delete req.session.cart.items[req.body.delId]
        res.locals.session=req.session
        return res.status(201).json({data:req.session.cart.items})

      }

    },
    check(req,res){
      return res.redirect("/login")
    },
    update(req,res){
      // for the first time creating cart

      if(!req.session.passport.user){
        req.flash("error","login first then try")
        console.log("err")
        return res.redirect("/login")
      }
      if(!req.session.cart){
        req.session.cart={
          items:{},
          totalQty:0,
          totalPrice:0
        }
      }
      // check if items does not exists in cart
      let cart=req.session.cart

      if(!cart.items[req.body._id]){
        cart.items[req.body._id]={
          item:req.body,
          qty:1
        }
        cart.totalQty+=1
        cart.totalPrice=cart.totalPrice+req.body.price
      }else{
        cart.items[req.body._id].qty+=1
        cart.totalQty+=1
        cart.totalPrice+=req.body.price
      }


      return res.status(201).json({totalQty:req.session.cart.totalQty})
    }
  }
}
module.exports=cartController
