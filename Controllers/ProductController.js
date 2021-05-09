const Order = require('../Schemas/OrderSchema.js')
const Delivery = require('../Schemas/deliverySchema.js')
const Payment = require('../Schemas/paymentSchema.js')
const Mongoose = require('mongoose')
const ManageProduct = require('../Schemas/product.js')
const OrderSchema = require('../Schemas/OrderSchema.js')
const ManageCategory = require('../Schemas/CategorySchema.js')
const checksum_lib = require("../Paytm/checksum");
const config = require("../Paytm/config");
const bcrypt = require('bcryptjs')
const User = require('../Schemas/User.js')
const product = require('../Schemas/product.js')


var ProductController = () => {
    return {
        getShop: async (req, res) => {
            res.locals.u = req.user || {}
            res.locals.c = await getCategoryName()
            let category = await ManageCategory.find()
            let product = await ManageProduct.find()
            res.render('./ejs/shop.ejs', { products: product, category: category })
        },
        postShop: async (req, res) => {

            res.locals.u = req.user || {}
            res.locals.c = await getCategoryName()
            let category = await ManageCategory.find()
            let product = {}
            if (typeof (req.body.category) == "undefined" && typeof (req.body.price) == "undefined") {
                product = await ManageProduct.find()
            }
            else if (typeof (req.body.category) != "undefined" && typeof (req.body.price) != "undefined") {
                if (req.body.price == "high") {
                    product = await ManageProduct.find({ categories: req.body.category }).sort({ 'Sale_Price': -1 })
                }
                else {
                    product = await ManageProduct.find({ categories: req.body.category }).sort({ 'Sale_Price': 1 })
                }
            }
            else if (typeof (req.body.category) == "undefined" || typeof (req.body.price) == "undefined") {
                if (typeof (req.body.category) == "undefined") {
                    if (req.body.price == "high") {
                        product = await ManageProduct.find().sort({ 'Sale_Price': -1 })
                    }
                    else {
                        product = await ManageProduct.find().sort({ 'Sale_Price': 1 })
                    }
                }
                else {
                    product = await ManageProduct.find({ categories: req.body.category })
                }
            }
            else {
                product = await ManageProduct.find({ categories: req.body.category })
            }
            res.render('./ejs/shop.ejs', { products: product, category: category })
        },
        getShopByCategory: async (req, res) => {
            res.locals.u = req.user || {}
            res.locals.c = await getCategoryName()
            let cat = await ManageCategory.find()
            let category = await ManageCategory.findOne({ _id: req.params.id })
            let product = await ManageProduct.find({ categories: { $all: [category.category_name] } })
            res.render('./ejs/shop.ejs', { products: product, category: cat })
        },
        postProduct: (req, res) => {
            //console.log(req.body._id)
            insertRecord(req, res);
        },
        getList: (req, res) => {
            let category = {}
            ManageCategory.find()
                .then(cat => {
                    category = cat
                })
                .catch(err => {
                    console.log(err)
                })
            ManageProduct.find((err, docs) => {
                if (!err) {
                    //console.log(docs)
                    res.render("./ejs/admin/product.ejs", {
                        list: docs,
                        product: {},
                        error: [],
                        cat: category
                    });
                }
                else {
                    console.log('Error in retrieving Products list:' + err);
                }

            })
        },
        postUpdate: (req, res) => {

            if (req.files !== null) {
                ManageProduct.updateOne({ _id: req.params.id },
                    {
                        Product_name: req.body.Product_name,
                        img_src: req.files.img.name,
                        categories: req.body.category,
                        Sale_Price: req.body.Sale_Price,
                        Qty: req.body.Qty
                    })
                    .then(product => {
                        //console.log("Product Updated.")
                    })
                    .catch(err => {
                        console.log(err)
                    })
                req.files.img.mv('.../.././Views/img/' + req.files.img.name, (err, img) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        //console.log("File Uploaded Successfully." + img)
                    }
                })
            }
            else {
                ManageProduct.updateOne({ _id: req.params.id },
                    {
                        Product_name: req.body.Product_name,
                        categories: req.body.category,
                        Sale_Price: req.body.Sale_Price,
                        Qty: req.body.Qty
                    })
                    .then(product => {
                        //console.log("Product Updated.")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            res.redirect("/admin/ManageProduct/list")
        },
        deleteProduct: (req, res) => {
            ManageProduct.findByIdAndRemove(req.params.id, (err, doc) => {
                if (!err) {
                    res.redirect('/admin/ManageProduct/list');
                }
                else { console.log('Error in product delete:' + err); }
            })
        },
        getCheckout: async (req, res) => {
            res.locals.u = req.user || {}
            res.locals.c = await getCategoryName()
            res.render('./ejs/checkout.ejs', {
                cart: req.session.cart
            })
        },
        postCheckout: async (req, res) => {
            res.locals.u = req.user || {}
            res.locals.c = await getCategoryName()
            if (!req.body.fname || !req.body.lname || !req.body.address1 || !req.body.address2 || !req.body.zip) {
                return res.redirect('/checkout')
            }
            if (emailValidation(req.body.email)) {
                req.flash('email', 'Provide valid Email ID')
                return res.redirect('/checkout')
            }
            if (numberValidation(req.body.mob)) {
                req.flash('mob', 'Enter Valid Mobile number')
                return res.redirect('/checkout')
            }
            else {
                makePayment(req, res)
            }
        },
        getOrder: async (req, res) => {
            res.locals.u = req.user || {}
            res.locals.c = await getCategoryName()
            if (req.user) {
                Order.find({ user_id: req.user._id })
                    .populate('delivery_id', 'delivery_status')
                    .populate('payment_id', 'payment_status')
                    .then(o => {
                        //console.log(o)
                        res.render('./ejs/order.ejs', { user: req.user, order: o })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            else {
                res.render('./ejs/order.ejs', { user: req.user || {}, order: {} })
            }
        },
        getAdminOrder: async (req, res) => {
            Order.find({})
                .populate('user_id', 'name')
                .populate('delivery_id', 'delivery_status')
                .populate('payment_id', 'payment_status')
                .exec()
                .then(o => {
                    //console.log(o)
                    res.render('./ejs/admin/AdminOrder.ejs', { order: o })

                })
                .catch(err => {
                    console.log(err)
                })

        },

        postOrderStatus: (req, res) => {
            console.log(req.body)

            Order.findOne({ _id: req.body.order_id })
                .then(o => {
                    Delivery.updateOne({ _id: o.delivery_id }, { delivery_status: req.body.delivery_status }, (err, data) => {
                        if (!err) {
                            res.redirect('/admin/manageorder')
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                })

        },

        //Payment
        postPaymentStatus: (req, res) => {
            Order.findOne({ _id: req.body.order_id })
                .then(o => {
                    Payment.updateOne({ _id: o.payment_id }, { payment_status: req.body.payment_status }, (err, data) => {
                        if (!err) {
                            res.redirect('/admin/manageorder')
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                })

        },
        paymentCompleted: async (req, res) => {
            //console.log(req.body)
            if (req.body.RESPCODE == "01") {
                res.redirect('/placeOrder')
            }
            else {
                res.redirect('/orders')
            }
        },
        placeOrder: (req, res) => {
            placeOrder(req)
            res.redirect('/delete-cart')
        },

        //Category
        getCategoryList: (req, res) => {
            ManageCategory.find()
                .then(c => {
                    //console.log(c)
                    res.render('./ejs/admin/category.ejs', { list: c })
                })
                .catch(err => {
                    console.log("Error")
                })
        },
        postCategory: (req, res) => {
            insertCategoryRecord(req, res);
        },
        postUpdateCategory: (req, res) => {
            //console.log(req.body)
            ManageCategory.findOne({_id : req.params.id},(err,records)=>{
                ManageProduct.updateMany({ categories : {$in : records.category_name}},{categories : req.body.category_name},(err,rec)=>{
                    console.log(rec)
                })
            })
            ManageCategory.updateOne({ _id: req.params.id }, { category_name: req.body.category_name })
                .then(category => {
                    console.log("Record Updated.")
                    res.redirect("/admin/managecategory/list")
                })
                .catch(err => {
                    console.log(err)
                })
        },
        deleteCategory: (req, res) => {
            //console.log(req.body, req.params)
            ManageProduct.find({ categories : {$in : req.params.name} })
                .then(p => {
                    //console.log(p)
                    if (p.length != 0) {
                        req.flash('err', 'Change All Product Records of Catgory that you want to remove.')
                        res.redirect('/admin/managecategory/list')
                    }
                    else {
                        ManageCategory.findByIdAndRemove(req.params.id, (err, doc) => {
                            if (!err) {
                                //console.log(doc)
                                console.log('Record Deleted.')
                                res.redirect('/admin/managecategory/list');
                            }
                            else { console.log('Error in product delete:' + err); }
                        })
                    }
                })

        },

        //delivery
        getDelivery: async (req, res) => {
            let delivery = await Delivery.findById({ _id: req.params.id })
            res.render('./ejs/admin/delivery-details.ejs', { delivery: delivery })
        },
        postDelivery: async (req, res) => {
            if (req.body.delivery == "" || numberValidation(req.body.num)) {
                req.flash('err', 'All Fields Required.')
                let url = "/admin/delivery-details/" + req.body._id
                res.redirect(url)
            }
            else {
                let d = await Delivery.updateOne({ _id: req.body._id }, { deliveredBy: req.body.delivery, delivery_boy_num: req.body.num })
            }
            res.redirect('/admin/manageorder')
        }
    }
}



function insertRecord(req, res) {
    //console.log(req.body)
    let product = new ManageProduct({
        Product_name: req.body.Product_name,
        img_src: req.files.img.name,
        categories: req.body.category,
        Sale_Price: req.body.Sale_Price,
        Qty: req.body.Qty
    })

    req.files.img.mv('.../.././Views/img/' + req.files.img.name, (err, img) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("File Uploaded Successfully." + img)
        }
    })
    product.save()
        .then(p => {
            return res.redirect('/admin/ManageProduct/list');
        })
        .catch(err => {
            console.log("err")
        })
}


var placeOrder = (req) => {

    let delivery = new Delivery({
        delivery_Address: req.session.address,
        contact_no: req.session.mob,
        delivery_status: "placed",
        name: req.session.name
    })
    delivery.save()
        .then(d => {
            //console.log(d)
        })
        .catch(err => {
            console.log(err)
        })
    let payment = new Payment({
        payment_status: req.session.paymentStatus
    })

    payment.save()
        .then(p => {
            //console.log(p)
        })
        .catch(err => {
            console.log(err)
        })
    let date = new Date()
    let today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
    for (var i = 0; i < req.session.cart.items.length; i++) {
        updateProductList(req.session.cart.items[i])
    }
    let order = new Order({
        order_date: today,
        user_id: req.user._id,
        products: req.session.cart,
        total: req.session.totalPrice,
        delivery_id: delivery._id,
        payment_id: payment._id,
        order_ID: req.session.orderID
    })
    order.save()
        .then(o => {
            //console.log(o)
        })
        .catch(err => {
            console.log(err)
        })
    delete req.session.address
    delete req.session.mob
    delete req.session.name
    delete req.session.paymentStatus
    delete req.session.orderID
}

var insertCategoryRecord = (req, res) => {
    let category = new ManageCategory({
        category_name: req.body.category_name
    })
    category.save()
        .then(c => {
            console.log("Record Inserted.")
            res.redirect('/admin/managecategory/list')
        })
        .catch(err => {
            console.log(err)
        })
}

var emailValidation = (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        //console.log("Email Validated")
        return false
    }
    else {
        return true
    }
}

var numberValidation = (mob) => {
    if (!mob) {
        return true
    }
    if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mob)) {
        return false
    }
    else {
        return true
    }
}

var makePayment = (req, res) => {
    req.session.name = req.body.fname + " " + req.body.lname
    req.session.address = req.body.address1 + " , " + req.body.address2 + " , " + req.body.zip
    req.session.mob = req.body.mob
    if (req.body.paymentMethod == "cod") {
        req.session.paymentStatus = "pending"
        req.session.orderID = 'order' + Date.now().toString()
        res.redirect('/placeOrder')
    }
    else {
        let num = req.user.phone_no;
        let str = num.toString()
        let id = req.user._id.toString()
        req.session.paymentStatus = "received"
        req.session.orderID = 'order' + Date.now().toString()
        //console.log(str, typeof str, typeof id)
        var paymentDetails = {
            amount: (req.session.cart.totalPrice).toString(),
            customerId: id,
            customerEmail: req.user.email,
            customerPhone: str
        }
        if (!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
            res.status(400).send('Payment failed')
        }
        else {
            var params = {};
            params['MID'] = process.env.MID;
            params['WEBSITE'] = 'WEBSTAGING';
            params['CHANNEL_ID'] = 'WEB';
            params['INDUSTRY_TYPE_ID'] = 'Retail';
            params['ORDER_ID'] = req.session.orderID
            params['CUST_ID'] = paymentDetails.customerId;
            params['TXN_AMOUNT'] = paymentDetails.amount;
            params['CALLBACK_URL'] = 'http://localhost:3300/payment-completed';
            params['EMAIL'] = paymentDetails.customerEmail;
            params['MOBILE_NO'] = paymentDetails.customerPhone;
            try {
                let checksum = checksum_lib.genchecksum(params, '@2Y7t1P1@a%61IcZ', function (err, checksum) {
                    if (err) {
                        console.log("err", err)
                    }
                    var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging

                    var form_fields = "";
                    for (var x in params) {
                        form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
                    }
                    form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
                    res.end();
                    //console.log("CheckSum" + checksum)
                })
            }
            catch (err) {
                console.log(err)
                res.redirect('/cart')
            }
        }
    }

}

let updateProductList = async (product) => {
    //console.log(product)
    let p = await ManageProduct.findOne({ _id: product.id })
    //console.log(p)
    let qty = p.Qty
    qty = qty - product.qty
    await ManageProduct.updateOne({ _id: product.id }, { Qty: qty })
    //console.log(p)
}

let getCategoryName = () => {
    return ManageCategory.find()
        .then(c => {
            return c
            //console.log(c)
        })
        .catch(err => {
        })
}

module.exports = ProductController