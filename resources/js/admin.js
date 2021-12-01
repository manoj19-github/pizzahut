import axios from "axios"
import moment from "moment-timezone"

const renderItems=(items)=>{
  let parsedItems=Object.values(items)
  return parsedItems.map((menuItem)=>{
    return `<p class="text-green-500 text-xs">${menuItem.item.name}  -   ${menuItem.qty} pcs</p>`
  }).join('')
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
            <input type="hidden" name="orderId" value="" value='${order._id}' />
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
    </tr>

      `
  }).join("")


}
const initAdmin=async()=>{
  try{
    const orderTable=document.querySelector("#orderTableBody")

    let markup

    let {data}=await axios.get("/admin/orders",{
      headers:{
        "X-Requested-With":"XMLHttpRequest"
      }
    })
    console.log("data",data)

    markup=generateMarkup(data)
    orderTable.innerHTML=markup
    console.log("mymarkup",markup)
  }catch(err){
    console.log(`something went wrong ${err}`)
  }


}
export default initAdmin
