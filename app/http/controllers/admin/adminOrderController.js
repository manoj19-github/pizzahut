const Order=require("../../../models/orderModel")
const Product=require("../../../models/productModel")

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
          if(req.xhr) return res.status(201).json(orders)

          return res.render('admin/orders')
        })
    },
    async products(req,res){
      try{
        const products=await Product.find({},null,{sort:{'updatedAt':-1}})
        if(products){
            if(req.xhr) return res.status(201).json(products)
        }
        return res.render("admin/products")
      }catch(err){
        console.log("err products",err)
        return res.redirect("/")
      }

    },
    async deleteProduct(req,res){
      try{

        const delProduct=await Product.findByIdAndDelete(req.body.productId)
        return res.status(201).json({message:"product Deleted Successfully",product:delProduct})
      }catch(err){
        console.log("delete Product",err)
        return res.status(401).json({message:"something went wrong"})
      }
    },
    async insertOrUpdate(req,res){
      try{
        const { name, price, size}=req.body
        let updateId=req.body?.hiddenProductId
        if(updateId){
          if(req?.file?.filename){
            const updatedProduct=await Product.findByIdAndUpdate(updateId,{
              name,price,size,image:req.file.filename,
            })
            console.log("updatedProduct",updatedProduct)
            return res.status(201).json({"message":"product Updated Successfully",product:updatedProduct,isUpdated:true})
          }else{
            const updatedProduct=await Product.findByIdAndUpdate(updateId,{
              name,price,size
            })
            console.log("updatedProduct",updatedProduct)
            return res.status(201).json({"message":"product Updated Successfully",product:updatedProduct,isUpdated:true})
          }
      }else{
          const newProduct=new Product({
            name,
            image:req.file.filename,
            price,
            size
          })
          const savedProduct=await newProduct.save()
          console.log("savedProduct",savedProduct)
          return  res.status(201).json({message:"new Product successfully added",product:savedProduct,isUpdated:false})
        }
      }catch(err){
        console.log("add product err",err)
        return res.status(401).json({message:"something went wrong"})
      }
    },
    async editProduct(req,res){
      try{
        console.log("productId",req.body.productId)
        const product=await Product.findById(req.body.productId)
        console.log("product",product)
        return  res.status(201).json({message:"product fetched ",product})
      }catch(err){
        return res.status(401).json({message:"something went wrong"})
      }
    }
  }
}
module.exports=adminOrderController
