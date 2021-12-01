// pacakage requirements
import axios from "axios"
import Noty from "noty"
import  initAdmin from "./admin"

// target our cart-btn and cart-counter
let addToCart=document.querySelectorAll(".add-to-cart")
let cartCounter=document.querySelector("#cartCounter")
let delCart=document.querySelectorAll(".del-cart-items")
let logoutForm=document.querySelector("#logOut")
let logoutBtn=document.querySelector("#logout-btn")
let alertMsg=document.querySelector("#success-alert")

logoutBtn.addEventListener("click",(e)=>{
  e.preventDefault()
  console.log("logout btn click")
  logoutForm.submit()
})

//data-cartId
// cart functionality method
const deleteCart=async(delId)=>{
  try{
    const {data}= await  axios.post("/delete-cart",{delId})
    console.log(data)
    new Noty({
      type:"success",
      timeout:1000,
      text:"Item deleted to Cart",
      progressBar:false
    }).show()

  }catch(err){
    console.log(err)
    new Noty({
      type:"error",
      timeout:1000,
      text:"Something went wrong",
      progressBar:false
    }).show()

  }
}
const updateCart=async(product)=>{
  try{
      const {data}=await axios.post("/update-cart",product)
      console.log(data)
      cartCounter.innerText=data.totalQty
      new Noty({
        type:"success",
        timeout:1000,
        text:"Item added to cart",
        progressBar:false
      }).show()
  }catch(err){
    console.log(err)
      new Noty({
        type:"error",
        timeout:1000,
        text:"Something went wrong !!",
        progressBar:false
      }).show()
  }

}

addToCart.forEach((btn)=>{
  btn.addEventListener("click",(e)=>{
    console.log(e)
    let pizza=JSON.parse(btn.getAttribute("data-pizza"))
    updateCart(pizza)
  })
})

delCart.forEach((btn)=>{
  btn.addEventListener("click",()=>{
    let delPizza=btn.getAttribute("data-cartId")
    deleteCart(delPizza)


  })
})


// remove success alert message after 3 second

if(alertMsg){
  setTimeout(()=>{
    alertMsg.remove()
  },3000)

}

initAdmin()
