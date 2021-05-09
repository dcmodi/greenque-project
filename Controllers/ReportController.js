const ManageProduct = require('../Schemas/product.js')
const ManageCategory = require('../Schemas/CategorySchema.js')
const User = require('../Schemas/User.js')
const Order = require('../Schemas/OrderSchema.js')
const pdf = require("html-pdf")

module.exports = () => {
    return {
        index: async (req, res) => {
            let user = await User.find()
            let products = await ManageProduct.find()
            let category = await ManageCategory.find()
            let order_data = await Order.find()
                .populate('user_id', 'name')
                .populate('delivery_id', 'delivery_status')
                .populate('payment_id', 'payment_status')
            res.render("./ejs/admin/reports.ejs", {
                customer: user,
                list: products,
                category: category,
                order: order_data
            })
        },
        getReports: async (req, res) => {
            let name = req.params.name
            if (name === "customer") {
                let user_data = await User.find({ isUser: true })

                createPDF(user_data, "CUSTOMER_REPORT.pdf", "customer", res)
            }
            else if (name === "product") {
                let product_data = {}

                if (req.body.category == "select" && req.body.price == "select") {
                    product_data = await ManageProduct.find()
                }
                else if (req.body.category != "select" && req.body.price != "select") {
                    if (req.body.price == "high") {
                        product_data = await ManageProduct.find({ categories: req.body.category }).sort({ 'Sale_Price': -1 })
                    }
                    else if (req.body.price == "low") {
                        product_data = await ManageProduct.find({ categories: req.body.category }).sort({ 'Sale_Price': 1 })
                    }
                    else {
                        product_data = await ManageProduct.find()
                    }
                }
                else if (req.body.category == "select" || req.body.price == "select") {
                    if (req.body.category == "select") {
                        if (req.body.price == "high") {
                            product_data = await ManageProduct.find().sort({ 'Sale_Price': -1 })
                        }
                        else if (req.body.price == "low") {
                            product_data = await ManageProduct.find().sort({ 'Sale_Price': 1 })
                        }
                        else {
                            product_data = await ManageProduct.find()
                        }
                    }
                    else {
                        product_data = await ManageProduct.find({ categories: req.body.category })
                    }
                }
                else {
                    product_data = await ManageProduct.find({ categories: req.body.category })
                }
                createPDF(product_data, "PRODUCT_REPORT.pdf", "product", res)
            }
            else if (name === "category") {
                let category_data = await ManageCategory.find()
                createPDF(category_data, "CATGORY_REPORT.pdf", "category", res)
            }
            else if (name === "order") {
                //console.log(req.body)
                let order_data = {}
                let delivery = req.body.delivery
                let payment = req.body.payment
                if (delivery == "select" && payment == "select") {
                    order_data = await Order.find()
                        .populate('user_id', 'name')
                        .populate('delivery_id', 'delivery_status')
                        .populate('payment_id', 'payment_status')
                }
                else {
                    if (delivery == "select" && payment != "select") {
                        if (payment == "pending") {
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status')
                                .populate('payment_id', 'payment_status', { payment_status: "pening" })
                        }
                        else if (payment == "received") {
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status')
                                .populate('payment_id', 'payment_status', { payment_status: "received" })
                        }
                    }
                    else if (delivery != "select" && payment == "select") {
                        if (delivery == "Placed") {
                            //console.log(delivery)
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "placed" })
                                .populate('payment_id', 'payment_status')
                        }
                        else if (delivery == "Dispatched") {
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "Dispatched" })
                                .populate('payment_id', 'payment_status')
                        }
                        else if (delivery == "Delivered") {

                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "Delivered" })
                                .populate('payment_id', 'payment_status')
                        }
                    }
                    else if (delivery != "select" && payment != "select") {
                        if (payment == "pending" && delivery == "Placed") {
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "placed" })
                                .populate('payment_id', 'payment_status', { payment_status: "pending" })
                        }
                        else if (payment == "received" && delivery == "Placed") {
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "placed" })
                                .populate('payment_id', 'payment_status', { payment_status: "received" })
                        }
                        if (payment == "pending" && delivery == "Dispatched") {
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "Dispatched" })
                                .populate('payment_id', 'payment_status', { payment_status: "pening" })
                        }
                        else if (payment == "received" && delivery == "Dispatched") {
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "Dispatched" })
                                .populate('payment_id', 'payment_status', { payment_status: "received" })
                        }
                        else if (payment == "pending" && delivery == "Delivered") {
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "Delivered" })
                                .populate('payment_id', 'payment_status', { payment_status: "pening" })
                        }
                        else if (payment == "received" && delivery == "Delivered") {
                            
                            order_data = await Order.find()
                                .populate('user_id', 'name')
                                .populate('delivery_id', 'delivery_status', { delivery_status: "Delivered" })
                                .populate('payment_id', 'payment_status', { payment_status: "received" })
                        }
                    }
                }
                //console.log("order Data:\n"+order_data)
                let orders = []
                for (var i = 0; i < order_data.length; i++) {
                    if (order_data[i].delivery_id != null && order_data[i].payment_id != null) {
                        let products = []
                        let qty = []
                        order_data[i].products.items.forEach(i => {
                            //console.log(i.name)
                            products.push(i.name)
                            qty.push(i.qty)
                        })
                        let order = {
                            _id: order_data[i].order_ID,
                            user_name: order_data[i].user_id.name,
                            products: products,
                            qty: qty,
                            amount: order_data[i].products.totalPrice,
                            order_date: order_data[i].order_date,
                            delivery: order_data[i].delivery_id.delivery_status,
                            payment: order_data[i].payment_id.payment_status
                        }
                        orders.push(order)
                    }

                }
                //console.log(orders[0])
                createPDF(orders, "ORDER_REPORT.pdf", "order", res)
            }
        }
    }
}


var createPDF = async (data, filename, value, res) => {
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        paginationOffset: 1,       // Override the initial pagination number

        "footer": {
            "height": "28mm",
            "contents": {
                //first: 'Cover page',
                //2: 'Second page', // Any page number is working. 1-based index
                default: '<div style="text-align:center;padding-top:10px;"><span>{{page}}</span>/<span>{{pages}}</span></div>', // fallback value
                //last: 'Last Page'
            }
        },
    }
    //console.log(data[0])
    const [err, html] = await new Promise(resolve => {
        let date = new Date()
        let today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
        let file = ""
        if (value === "customer") {
            file = "customerTemplate.ejs"
        }
        if (value === "category") {
            file = "categoryTemplate.ejs"
        }
        if (value === "product") {
            file = "productTemplate.ejs"

        }
        if (value === "order") {
            file = "orderTemplate.ejs"
        }

        res.render("./ejs/admin/" + file, {
            data: data,
            d: today
        }, (err, html) => {
            resolve([err, html])
        })
    })
    //console.log(html)
    if (html) {
        pdf.create(html, options).toFile(filename, (err, file) => {
            if (!err) {
                let files = file.filename.toString().split("\\")
                //console.log("done..")
                res.download(files[files.length - 1])
            }
        })
    }
}