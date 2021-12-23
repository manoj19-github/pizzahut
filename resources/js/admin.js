import axios from "axios"
import moment from "moment-timezone"
import Noty from "noty"
import swal from 'sweetalert';



let productData=[]
let productMarkup

const setOrderDataForm=document.querySelector("#setOrderData")
const productTable=document.querySelector("#productTable")
const previewImg=document.querySelector("#previewImg")
const updateBtn=document.getElementsByClassName("updateBtn");
const deleteBtn=document.getElementsByClassName('deleteBtn')
const modalBtn=document.getElementById("newProduct-btn")

// update modal

const previewFile=(input)=>{
  let file=input.target.files[0]
  if(file){
    let reader=new FileReader()
    reader.onload=function(){
      previewImg.innerHTML=`<img src="${reader.result}" class="w-10 my-2" alt="img"/>`
    }
    reader.readAsDataURL(file)
  }

}
const renderItems=(items)=>{
  let parsedItems=Object.values(items)
  return parsedItems.map((menuItem)=>{
    return `<p class="text-green-500 text-xs">${menuItem.item.name}  -   ${menuItem.qty} pcs</p>`
  }).join('')
}


// delete the product

const deleteProduct=()=>{
  for( let delBtn of deleteBtn){
    delBtn.addEventListener("click",()=>{
      let productId=delBtn.getAttribute("data-deleteId")
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this product !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(async(willDelete) => {
        if (willDelete) {
          try{
            let {data}=await axios.post("/admin/product/delete",{productId})
            let newData=productData.filter((product)=>product._id!==data.product._id)
            // productData=newData
            // let productMarkup=generateProduct(productData)
            // productTable.innerHTML=""
            // productTable.innerHTML=productMarkup

            new Noty({
              type:"success",
              timeout:1000,
              text:`${data.message}`,
              progressBar:false
            }).show()
            setTimeout(()=>{
              window.location.reload()
              window.location.href="/admin/products"
            },3000)
          }catch(err){
            console.log(err)
            new Noty({
              type:"error",
              timeout:1000,
              text:`Something went wrong`,
              progressBar:false
            }).show()
            setTimeout(()=>{
              window.location.reload()
              window.location.href="/admin/products"
            },3000)
          }
        }
      });
    })
  }
}



 const updateProduct=()=>{
   console.log("update product")

  //console.log(updateBtn)
  for(let upBtn of updateBtn){
  console.log(upBtn)

    upBtn.addEventListener("click",async()=>{
      console.log("upBtn")
      setOrderDataForm.reset()
      previewImg.innerHTML=""

      let productId=upBtn.getAttribute("data-updateId")
      console.log("productId",productId)
      try{
        if(productId){
            modalBtn.click()
            let {data}=await axios.post(`/admin/product/edit`,{productId})
            setOrderDataForm.pizzaName.value=data.product.name
            setOrderDataForm.pizzaPrice.value=data.product.price
            setOrderDataForm.pizzaSize.value=data.product.size
            setOrderDataForm.hiddenProductId.value=data.product._id
            if(previewImg)
              previewImg.innerHTML=`<img src="/images/${data.product.image}" class="w-7 my-2" alt="${data.product.name}"/>`


        }
      }catch(err){
        console.log(err)
        new Noty({
          type:"error",
          timeout:1000,
          text:`Something went wrong`,
          progressBar:false
        }).show()


      }

    })
  }
}


const generateProduct=(products)=>{
  function mydata(){

  }
  return products.map((product)=>{
      return `<tr>
        <td class="border px-4 py-2 text-green-300">
          <img  src="/images/${product.image}" class="h-20 my-2" alt="${product._id}">
          <p class="text-green-800 text-sm font-bold">${product._id}</p>

        </td>
        <td class="border px-4 py-2">${product.name}</td>
        <td class="border px-4 py-2">${product.price}</td>
        <td class="border px-4 py-2">${product.size}</td>
        <td class="border px-4 py-2">${moment(product.updatedAt).tz("Asia/Kolkata").format("Do MMM h A")}</td>

        <td class="border px-4 py-2">
          <button  data-updateId="${product._id}" type="button" class="updateBtn btn bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </td>
        <td class="border px-4 py-2">
          <button data-deleteId="${product._id}" type="button" class="deleteBtn btn bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-white p-2">
            <svg  xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      </tr>

        `
    }).join("")
}
const generateMarkup=(orders)=>{
  return orders.map((order)=>{
    return `<tr>
      <td class="border px-4 py-2 text-green-300">
        <p class="text-green-800 text-sm font-bold">${order._id}</p>
        <div>${renderItems(order.items)}</div>
      </td>
      <td class="border px-4 py-2">${order.customerId.name}</td>
      <td class="border px-4 py-2">${order.phone}</td>
      <td class="border px-4 py-2">${order.address}</td>
      <td class="border px-4 py-2">
        <div class="inline-block relative w-64">
          <form action="/admin/order/status" method="POST">
            <input type="hidden" name="orderId" value="${order._id}" />
            <select name="status" onchange="this.form.submit()" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-900 px-4 py-2 rounded shadow leading-tight focus:ountline-none focus:shadow-outline">
                  <option value="order_placed" ${order.status =="order_placed" ? "selected":""}>Placed</option>
                  <option value="confirmed" ${order.status =="confirmed" ? "selected":""}>Confirmed</option>
                  <option value="prepared" ${order.status =="prepared" ? "selected":""}>Prepared</option>
                  <option value="shipped" ${order.status =="shipped" ? "selected":""}>Shipped</option>
                  <option value="delivered" ${order.status =="delivered" ? "selected":""}>Delivered</option>
                  <option value="rejected" ${order.status =="rejected" ? "selected":""}>Rejected</option>
            </select>
          </form>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          </div>
        </div>
      </td>
      <td class="border px-4 py-2">
        ${moment(order.createdAt).tz("Asia/Kolkata").format("hh:mm A")}
      </td>
      <td class="border px-4 py-2" id="paymentStatus">
        ${order.paymentStatus?`<span class="text-green-500">Paid</span>`:`<span class="text-red-500">Not Paid</span>`}
      </td>
    </tr>

      `
  }).join("")


}
export const initAdmin=async(socket)=>{
  let orderData=[]

  try{
    const orderTable=document.querySelector("#orderTableBody")
    if(orderTable){
      let markup

      let {data}=await axios.get("/admin/orders",{
        headers:{
          "X-Requested-With":"XMLHttpRequest"
        }
      })
      orderData=data
      markup=generateMarkup(orderData)
      orderTable.innerHTML=markup

      socket.on("orderPlaced",(newOrder)=>{
        new Noty({
          type:"success",
          timeout:1000,
          text:"new Order Added ",
          progressBar:false
        }).show()
        orderData.unshift(newOrder)
        console.log("new data",orderData)
        orderTable.innerHTML=""
        orderTable.innerHTML=generateMarkup(orderData)


      })
      socket.on("paymentUpdated",(data)=>{
          document.getElementById("paymentStatus").innerHTML=""
          document.getElementById("paymentStatus").innerHTML=`<span class="text-green-500">${data.payment}</span>`
      })

    }


  }catch(err){
    console.log(`something went wrong ${err}`)
  }

}
const addProduct=()=>{
      const addProductForm=document.querySelector("#setOrderData")
      const ProductImage=document.querySelector("#pizzaImage")
      addProductForm.reset()
      previewImg.innerHTML=""
      let productImage=""
      if(addProductForm){
        ProductImage.addEventListener("change",(e)=>{
          productImage=e.target.files[0]
          previewFile(e)

        })
        addProductForm.addEventListener("submit",async(e)=>{
          e.preventDefault()
          try{
            let formData=new FormData()
            formData.append("name",addProductForm.pizzaName.value)
            formData.append("price",addProductForm.pizzaPrice.value)
            formData.append("size",addProductForm.pizzaSize.value)
            if(addProductForm.hiddenProductId?.value !=""){
              formData.append("hiddenProductId",addProductForm.hiddenProductId?.value)
            }
            if(productImage!=""){
              formData.append("image",productImage)
            }
            let {data}=await axios.post(`/admin/product/insert`,formData)
            new Noty({
              type:"success",
              timeout:1000,
              text:`${data.message}`,
              progressBar:false
            }).show()
            // setTimeout(()=>{
            //   window.location.href="/admin/products"
            // },3000)
            // if(data.isUpdated){
                //let updatedProduct=productData.filter((product)=>product._id !== data.product?._id)
                // productData=updatedProduct
                // productData.unshift(data.product)
            // }else{
            // //  productData.unshift(data.product)
            // }
            // productTable.innerHTML=""
             addProductForm.hiddenProductId.value=""
            // let productMarkup=generateProduct(productData)
            // productTable.innerHTML=productMarkup
            setTimeout(()=>{
              window.location.reload()
              window.location.href="/admin/products"
            },3000)

          }catch(err){
            console.log("add product err",err)
            addProductForm.hiddenProductId.value=""
            new Noty({
              type:"error",
              timeout:1000,
              text:`Something went wrong`,
              progressBar:false
            }).show()
            setTimeout(()=>{
              window.location.reload()
              window.location.href="/admin/products"
            },3000)

          }


      })
    }
  }


export const fetchProduct=async()=>{
  try{

    if(productTable){

      let {data}=await axios.get(`/admin/products`,{
        headers:{
          "X-Requested-With":"XMLHttpRequest"
        }
      })
      productData=data

      let productMarkup=generateProduct(productData)
      productTable.innerHTML=productMarkup
      modalBtn.addEventListener("mouseover",()=>{
        previewImg.innerHTML=""
        document.querySelector("#setOrderData").reset()


      })
      updateProduct()
      deleteProduct()
      addProduct()
    }
  }catch(err){
    console.log("err product",err)

  }
}





  // delete product
