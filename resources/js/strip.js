import axios from "axios"
import Noty from "noty"
import {loadStripe} from '@stripe/stripe-js';
import {placeOrder} from "./apiService"
import {CardWidget} from "./CardWidget"
const paymentType=document.querySelector("#paymentType")
const paymentForm=document.querySelector("#payment-form")



export const initStrip=async()=>{
  let elements
  let card=null
  let isCard=false
  let stripe

  try{
    stripe = await loadStripe('pk_test_51JXT3ESFSswPl5DC64Xs32NZq9Tz8Se3fN6vmqz3jJjgKaGVusyaWRJhYlJopaq60NmtSlT0v6D0cRPhvx4Sw1gz00M7UcioCL');
  }catch(err){
    console.log("stripe err")
  }

  if(paymentType){
    paymentType.addEventListener("change",async(e)=>{
      if(e.target.value==="card"){
        // display widget
        isCard=true
        // mountStripe()
        card=new CardWidget(stripe)
        await card.mount()
      }else{
        card.destroy()
      }
    })
  }
  if(paymentForm){
    paymentForm.addEventListener("submit",async(e)=>{
      e.preventDefault()
      let formData=new FormData(paymentForm)
      let formObject={}
      for(let [key,value] of formData.entries()){
        formObject[key]=value
      }
        // verify card
        if(!isCard){
          console.log(`is not card `)
          placeOrder(formObject)
          return
        }
        const token = await card.createToken()
        if(token){
          formObject.stripeToken=token.id
          placeOrder(formObject)
          console.log(formObject)
        }else{
          console.log("token not generated")
        }
    })
  }
}
