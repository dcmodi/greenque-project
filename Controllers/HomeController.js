const { compareSync } = require('bcryptjs')
const { urlencoded } = require('express')
const { get } = require('mongoose')
const ManageCategory = require('../Schemas/CategorySchema.js')
const ManageProduct = require('../Schemas/product.js')
const Order = require('../Schemas/OrderSchema.js')
const User = require('../Schemas/User.js')

let getCategoryName = () => {
    return ManageCategory.find()
        .then(c => {
            return c
            //console.log(c)
        })
        .catch(err => {
        })
}
var homeController = () => {
    return {
        index: async (req, res) => {
            user = req.user || {}
            //console.log(user)
            if (Object.keys(user).length == 0) {
                res.locals.u = req.user || {}
                res.locals.c = await getCategoryName()
                //console.log(res.locals)
                let product = await ManageProduct.find()
                res.render('./ejs/home.ejs', { user: user, products: product })
            }
            else if(user.isUser){
                res.locals.u = req.user || {}
                res.locals.c = await getCategoryName()
                let product = await ManageProduct.find()
                res.render('./ejs/home.ejs', { user: user, products: product })
            }
            else {
                let orders = Order.find()
                let users = User.find()
                let products = ManageProduct.find()
                res.render('./ejs/admin/home.ejs',{
                    user_count : (await users).length,
                    order_count : (await orders).length,
                    product_count : (await products).length
                })
            }

        },
        about: async (req, res) => {
            res.locals.u = req.user || {}
            res.locals.c = await getCategoryName()
            res.render('./ejs/about.ejs')
        }
    }
}


module.exports = homeController