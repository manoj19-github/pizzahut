import axios from "axios"
import Noty from "noty"
export async function placeOrder(formObject){
  
  try{
    let {data}=await axios.post("/orders",formObject)
    new Noty({
      type:"success",
      timeout:1000,
      text:`${data.message}`,
      progressBar:false
    }).show()
    // setTimeout(()=>{
    //   window.location.href="/customer/orders"
    // },2000)
  }catch(err){
    console.log("error",err)
    new Noty({
      type:"error",
      timeout:1000,
      text:`something went wrong`,
      progressBar:false
    }).show()
  }
}
