var report = document.querySelector('#report')
var customer = document.querySelector('.customer')
var product = document.querySelector('.product')
var order = document.querySelector('.order')
var category = document.querySelector('.category')
var delivery = document.querySelector('#delivery')
var payment = document.querySelector('#payment')


report.addEventListener("change", () => {
    customer.style.display = "none"
    product.style.display = "none"
    order.style.display = "none"
    category.style.display = "none"
    if (report.options[1].selected == true) {
        customer.style.display = "block"
    }
    else if (report.options[2].selected == true) {
        product.style.display = "block"
    }
    else if (report.options[3].selected == true) {
        order.style.display = "block"
    }
    else if (report.options[4].selected == true) {
        category.style.display = "block"
    }
})

var categoryChange = () => {
    let value = ""
    for (o of document.querySelector("#selectCategory").options) {
        if (o.selected) {
            value = o.value
        }
    }
    let elem = []
    for (v of document.querySelectorAll(".categoryList")) {
        v.parentElement.style.display = "flex"
        if (value == "select") {
            elem.push(v)
            //v.parentElement.style.display = "flex"
        }
        else if (v.innerText.indexOf(value) >= 0) {
            elem.push(v)
        }
        else {
            v.parentElement.style.display = "none"
        }
    }
    //console.log(value)
    //console.log(elem)
    priceChange(elem)
}

//Price Filter
var priceChange = (elems) => {
    //console.log(elems[5].parentElement)
    let price = ""
    for (o of document.querySelector("#selectPrice").options) {
        if (o.selected) {
            price = o.value
        }
    }
    //console.log(price)
    let prices = []

    for (p of elems) {
        prices.push(parseInt(p.parentElement.innerText.split("\n")[p.parentElement.innerText.split("\n").length - 2]))
    }
    if (price === "low") {
        prices.sort(function (a, b) {
            return a - b
        })
        //console.log(prices)
        sortElements(prices, elems)
    }
    else if (price === "high") {
        prices.sort(function (a, b) {
            return a - b
        })
        prices.reverse()
        sortElements(prices, elems)
    }
    else {
        sortElements(prices, elems)
    }
    //console.log(price,prices)
}

var sortElements = (prices, elems) => {
    let len = elems.length
    let parent = elems[0].parentElement.parentElement
    //console.log(parent)
    let newElems = []
    for (var i = 0; i < prices.length; i++) {
        //console.log(i+":"+prices[i])
        //console.log(elems[i])
        let l = elems.length
        for (var j = 0; j < l; j++) {
            let num = parseInt(elems[j].parentElement.children[4].innerText.trim())
            //console.log(num)
            if (num == prices[i]) {
                newElems.push(elems[j].parentElement)
                elems[j].parentElement.style.display = "none"
                elems.splice(j, 1)
                prices.splice(i, 1)
                i--
                break;
            }
        }
    }
    //console.log(newElems)
    parent.removeAttribute("id")
    for(var i = 0; i < newElems.length; i++){
        parent.appendChild(newElems[i])
        newElems[i].style.display = "flex"
        newElems[i].setAttribute("id","backcolor")
    }
}


var downloadFile = (value, elem) => {
    if (value === "product") {
        let v = ""
        for (o of document.querySelector("#selectCategory").options) {
            if (o.selected) {
                v = o.value
            }
        }
        console.log(elem)
        console.log("submit")
        document.querySelector("#product-form").submit()
    }
    else if(value === "customer"){
        document.querySelector("#customer-form").submit()
    }
    else if(value === "order"){
        document.querySelector("#order-form").submit()
    }
    else{
        document.querySelector("#category-form").submit()
    }
}

delivery.addEventListener("change",()=>{
    sortOrders()
})
payment.addEventListener("change",()=>{
    sortOrders()
    
})

var sortOrders = ()=>{
    let orders = document.querySelectorAll('.orders')
    let payment_value = "",delivery_value = ""
    for (o of document.querySelector("#payment").options) {
        if (o.selected) {
            payment_value = o.text
        }
    }
    for (o of document.querySelector("#delivery").options) {
        if (o.selected) {
            delivery_value = o.text
        }
    }
    for(o of orders){
        //console.log()
        o.parentElement.style.display = "block"
        if(payment_value != "--Select Payment Status--" || delivery_value != "--Select Delivery Status--"){
            if(payment_value != "--Select Payment Status--" && delivery_value == "--Select Delivery Status--"){
                if(payment_value == "Pending" && o.children[7].innerText == "Pending"){
                    //console.log("pending")
                    o.style.display = "flex"
                }
                else if(payment_value == "Received" && o.children[7].innerText == "Received"){
                    console.log("Received")
                    o.style.display = "flex"
                }
                else{
                    console.log("Select")
                    o.parentElement.style.display = "none"
                }
            }
            else if(payment_value == "--Select Payment Status--" && delivery_value != "--Select Delivery Status--"){
                if(delivery_value == "Placed" && o.children[6].innerText == "Placed"){
                    o.style.display = "flex"
                }
                else if(delivery_value == "Dispatched" && o.children[6].innerText == "Dispatched"){
                    o.style.display = "flex"
                }
                else if(delivery_value == "Delivered" && o.children[6].innerText == "Delivered"){
                    o.style.display = "flex"
                }
                else{
                    o.parentElement.style.display = "none"
                }
            }
            else if(payment_value != "--Select Payment Status--" && delivery_value != "--Select Delivery Status--"){
                if(delivery_value == "Placed" && o.children[6].innerText == "Placed" && payment_value == "Pending" && o.children[7].innerText == "Pending"){
                    o.style.display = "flex"
                }
                else if(delivery_value == "Dispatched" && o.children[6].innerText == "Dispatched" && payment_value == "Pending" && o.children[7].innerText == "Pending"){
                    o.style.display = "flex"
                }
                else if(delivery_value == "Delivered" && o.children[6].innerText == "Delivered" && payment_value == "Pending" && o.children[7].innerText == "Pending"){
                    o.style.display = "flex"
                }
                else if(delivery_value == "Placed" && o.children[6].innerText == "Placed" && payment_value == "Received" && o.children[7].innerText == "Received"){
                    o.style.display = "flex"
                }
                else if(delivery_value == "Dispatched" && o.children[6].innerText == "Dispatched" && payment_value == "Received" && o.children[7].innerText == "Received"){
                    o.style.display = "flex"
                }
                else if(delivery_value == "Delivered" && o.children[6].innerText == "Delivered" && payment_value == "Received" && o.children[7].innerText == "Received"){
                    o.style.display = "flex"
                }
                else{
                    o.parentElement.style.display = "none"
                }
            }
        }
        if(payment_value == "--Select Payment Status--" && delivery_value == "--Select Delivery Status--"){
            o.style.display = "flex"
        }
    }
}
