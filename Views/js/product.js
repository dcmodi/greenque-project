var productForm = document.querySelector("#productForm")
var input = []
var slct = ""
var values = []
var products = []
var err = document.querySelectorAll(".text-danger")

for (p of document.querySelectorAll(".products")) {
    p.textContent = p.textContent.replace(/^\s+|\s+$/gm, '')
    products.push(p.textContent)
}
var displayForm = () => {
    id = "", values = [],productName = ""
    input = document.querySelectorAll(".form-control")
    input[0].value = ""
    input[1].value = ""
    input[2].value = ""
    input[3].value = ""
    input[4].value = ""
    if (productForm.style.display === "" || productForm.style.display === "none") {
        console.log(productForm.style.display)
        productForm.style.display = "flex";
    }
    else {
        console.log(productForm.style.display)
        productForm.style.display = "none";
    }
}
var validateForm = () => {
    let flag = 0
    input = document.querySelectorAll(".form-control")
    slct = document.querySelector(".categoryList").options
    for (o of slct) {
        if (o.selected) {

            values.push(o.value)
        }
    }
    if (input[0].value == "") {
        err[0].textContent = "Product Name is Required."
        flag = 1
    }
    else {
        if (productName !== input[0].value) {
            if (products.includes(input[0].value)) {
                err[0].textContent = "Product with same name exists."
                flag = 1
            }
        }
    }
    if (!Number.isInteger(parseInt(input[3].value))) {
        err[3].textContent = "Please enter valid sale price."
        flag = 1
    }
    if (!Number.isInteger(parseInt(input[4].value))) {
        err[4].textContent = "Please enter valid Qty."
        flag = 1
    }
    //console.log(values)
    if (values.length == 0) {
        err[1].textContent = "Please select at least one category."
        flag = 1
    }
    if (input[2].value === "") {
        if (productName === "") {
            err[2].textContent = "Please select image."
            flag = 1
        }
    }
    else {
        if (!(["png", "PNG", "jpg", "jpeg", "JPG", "JPEG"].includes(input[2].value.split(".")[input[2].value.split(".").length - 1]))) {
            err[2].textContent = "Image type must be png , jpg ,jpeg"
            flag = 1
        }
    }
    if (flag == 1)
    {1
        return false
    }
        
    else
    {
        if(id == ""){
            productForm.action = "/admin/ManageProduct"
        }
        else{
            productForm.action = "/admin/ManageProduct/" + id
        }                
        return true
    }
}
var id = "", productName = ""
var updateForm = (elem) => {
    displayForm()
    let slctValues = []
    input = document.querySelectorAll(".form-control")
    slct = document.querySelector(".categoryList").options
    for (o of slct) {
        values.push(o.text)
    }
    let product = elem.parentElement.parentElement.children
    //console.log(product)
    productForm.style.display = "flex";
    id = product[0].value
    productName = product[1].textContent
    input[0].value = product[1].textContent
    slctValues = product[2].innerText.split("\n")
    for (let i = 0; i < slctValues.length; i++) {
        if (values.includes(slctValues[i])) {
            slct[i].selected = true
        }
    }
    input[3].value = product[4].innerText
    input[4].value = product[5].innerText
}