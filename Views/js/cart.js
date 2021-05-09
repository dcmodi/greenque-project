let qty = document.querySelectorAll(".qty")


qty.forEach((qt) => {
    qt.addEventListener("keydown", (e) => {
        //console.log(elem.value,elem.previousElementSibling)
        //console.log((qt.value), (qt.value))
        //console.log(e)
        e.preventDefault()
    })
})

qty.forEach(qt=>{
    qt.addEventListener("change",(e)=>{
        let id = qt.previousElementSibling.value
            let q = qt.value
            //console.log(q)
            updateData(id, q)
    })
})
var updateData = (id, q) => {
    $.post('/update-cart', { id: id, qty: q }).done(function (resp) {
        updateCart(resp.cart)
    });
}
var updateCart = (cart) => {
    let prices = document.querySelectorAll('.price')
    let total = document.querySelector('.total')
    //console.log(total.children)
    //console.log(cart)
    total.children[1].innerText = (cart.totalPrice).toString()
    for (var i = 0; i < cart.items.length; i++) {
        prices[i].innerText = (cart.items[i].qty * cart.items[i].price).toString()
    }
}
