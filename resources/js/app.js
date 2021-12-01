// pacakage requirements
import axios from "axios"
import Noty from "noty"
import  initAdmin from "./admin"
import moment from "moment-timezone"

// target our cart-btn and cart-counter
let addToCart=document.querySelectorAll(".add-to-cart")
let cartCounter=document.querySelector("#cartCounter")
let delCart=document.querySelectorAll(".del-cart-items")
let logoutForm=document.querySelector("#logOut")
let logoutBtn=document.querySelector("#logout-btn")
let alertMsg=document.querySelector("#success-alert")
let deliveryStatus=document.querySelector(".deliveryStatus")
let delivery=document.querySelector(".delivery")

let Order=document.querySelector("#hiddenOrder")?
  document.querySelector("#hiddenOrder").value:null
let statuses=document.querySelectorAll(".status-line")
let orderData;
if(Order){
  orderData=JSON.parse(Order)
}

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


// change order status
const updateStatus=(orderData)=>{


  let time=document.createElement("small")



  let stepCompleted=true
  statuses.forEach((status)=>{
    status.classList.remove("step-completed")
    status.classList.remove("current-status")

  })
  statuses.forEach((status)=>{
    let dataProp=status.getAttribute("data-status")
    if(stepCompleted){
      status.classList.add("step-completed")
    }
    if(dataProp===orderData.status){
      stepCompleted=false
      time.innerText=moment(orderData.updatedAt).tz("Asia/Kolkata")
        .format("hh:mm A")
      status.appendChild(time)
      if(status){
        status
        .classList.add("current-status")
      }
    }
  })
  if(orderData.status==="rejected"){
    delivery.classList.add("current-status")
    delivery.classList.add("rejected")

    if(delivery.classList.contains("step-completed")){
      delivery.classList.remove("step-completed")
    }
    deliveryStatus.innerText="Order Rejected"

  }
}
console.log("manoj")
if(orderData){
  updateStatus(orderData)
}

console.log("manoj")


// socket work

let socket=io()
if(orderData){
  socket.emit("join",`order_${orderData._id}`)
}

let adminAreaPath = window.location.pathname
  console.log("adminpath",adminAreaPath)
if(adminAreaPath.includes("admin")){
  initAdmin(socket)
  console.log("join")
  socket.emit("join","adminRoom")

}
socket.on('orderUpdated',(data)=>{
  try{
    const updatedOrder={...orderData}
    updatedOrder.updatedAt=moment().format()
    updatedOrder.status=data.status
    console.log(data)
    updateStatus(updatedOrder)
    new Noty({
      type:"success",
      timeout:1000,
      text:"Order Updated ",
      progressBar:false
    }).show()
  }catch(err){
    console.log(err)
  }

})
